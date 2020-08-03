const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const cors = require('cors')({origin: true});
admin.initializeApp(functions.config().firebase);
//const asignarMateriasAUsuario = require('../front/src/helpers/Firebase-user');

/* healthcheck endpoint */
exports.ping = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
  response.send("pong");
  });
 });

 /* create user creates a user into firebase auth service */
/*exports.createUser = functions.https.onRequest( (data, context) => {
   console.log('Name', data.name);
    return admin.auth().createUser({
        email: data.mail,
        emailVerified: false,
        phoneNumber: '+11234567890',
        password: data.pass,
        displayName: data.name,
        photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: false
      })
        .then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully created new user:', userRecord.uid);
          return userRecord
        })
        .catch((error) => {
          console.log('Error creating new user:', error);
          return error
        });
})



/* register sets the user record to firestore */
exports.register = functions.auth.user().onCreate((data)=> {
    const user = {
      id: data.uid,
      mail: data.email,
      fechaCreacion: data.metadata.creationTime,
      nombre: '',
      apellido: '',
      telefono: '',
      foto: '',
      primerLogin: true,
      cambiarPassword: false,
      instituciones: [],
      rol: 1,
    }

    return admin.firestore().collection('usuarios')
    .doc(data.uid)
    .set(user)
    .then(doc => console.log('user added', doc))   
});

exports.user = functions.https.onCall((data) => {
  return admin.auth().createUser(data)
    .catch((error) => {
      throw new functions.https.HttpsError('internal', error.message)
    });
});

exports.asignarFuncion = async (data) => {
  const { instId, courseId, subjectId } = data;
  let instRef = '',
  courseRef = [],
  subjectRef = [],
  cursosObj = [];

instRef = admin.firestore().doc(`/instituciones/${instId}`);

if (courseId) {
  courseRef = [
    admin.firestore().doc(`/instituciones/${instId}/cursos/${courseId}`),
  ];
  if (subjectId) {
    subjectRef = [
      admin.firestore().doc(
        `/instituciones/${instId}/cursos/${courseId}/materias/${subjectId}`
      ),
    ];
    cursosObj.push({ curso_id: courseRef, materias: subjectRef });
  } else {
    // traer todas las materias del curso
    const matRef = admin.firestore()
      .doc(`/instituciones/${instId}/cursos/${courseId}`)
      .collection('materias');
    const mat = await matRef.get();
    mat.forEach((mat) => {
      const materiaRef = admin.firestore().doc(
        `/instituciones/${instId}/cursos/${courseId}/materias/${mat.id}`
      );
      subjectRef.push(materiaRef);
    });

    cursosObj.push({ curso_id: courseRef, materias: subjectRef });
  }
} else {
  // traer todos los cursos de la inst y todas las materias de los cursos
  const cursoRef = admin.firestore()
    .doc(`/instituciones/${instId}`)
    .collection('cursos');
  const cursos = await cursoRef.get();
 
  for (const curso of cursos) {
    const arrayMaterias = [];
    const materiaRef = admin.firestore()
      .doc(`/instituciones/${instId}/cursos/${curso.id}`)
      .collection('materias');
    const materias = materiaRef.get();

    materias.forEach((mat) => {
      const materiaRefDoc = admin.firestore().doc(
        `/instituciones/${instId}/cursos/${courseId}/materias/${mat.id}`
      );
      arrayMaterias.push(materiaRefDoc);
    });

    const cursoRef = admin.firestore().doc(
      `/instituciones/${instId}/cursos/${curso.id}`
    );

    const cursoObj = {
      curso_id: cursoRef,
      materias: arrayMaterias,
    };

    cursosObj.push(cursoObj);
  }
}

const instObj = [
  {
    institucion_id: instRef,
    cursos: cursosObj,
  },
];

return instObj;
}

exports.asignarMaterias = functions.https.onCall(async (data)=> {

  try {
    const instObj = await this.asignarFuncion(data);
    await admin.firestore().collection('usuarios')
    .doc(data.uid)
    .set( { instituciones: instObj }, { merge: true });
  } catch (error) {
    console.log('error', error);
  }
  
});

let transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'trida.app@gmail.com',
    pass: 'tr1d@@pp'
  }
}));

exports.sendMail = functions.https.onCall((email) => {
      const dest = email;
      const mailOptions = {
          from: 'Trida App <trida.app@gmail.com>',
          to: dest,
          subject: 'Te invitaron a Trida!',
          html: `<p style="font-size: 16px;">En instantes recibirás un mail para establecer tu contraseña. <br />
          Luego, podés loguearte con este mail y tu contraseña en trida.com.ar</p>
              <br />
          `
      };

    return transporter.sendMail(mailOptions);
});
