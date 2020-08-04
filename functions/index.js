/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const cors = require('cors')({origin: true});
admin.initializeApp(functions.config().firebase);

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

const getSubCollectionRef = (doc, collection) => {
  return admin.firestore().doc(doc).collection(collection);
};

const getSubCollectionIds = async (ref) => {
  let array = [];
  const items = await ref.get();
  items.forEach((doc) => {
    array.push(doc.id);
  });
  return array;
};

const getDocRef = (doc) => {
  return admin.firestore().doc(doc);
};


exports.asignarFuncion = async ({ instId, courseId, subjectId }) => {
  let instRef = '',
  courseRef = [],
  subjectRef = [],
  cursosObj = [];

  let referenciaAInst = `/instituciones/${instId}`;
  instRef = getDocRef(referenciaAInst);

  // si se seleccionó curso, busco las materias
  if (courseId) {
    let referenciaACurso = `${referenciaAInst}/cursos/${courseId}`;
    courseRef = getDocRef(referenciaACurso);

    // si se seleccionó materia, busco las referencias y armo el objeto cursos
    if (subjectId) {
      subjectRef = [getDocRef(`${referenciaACurso}/materias/${subjectId}`)];
      cursosObj.push({ curso_id: courseRef, materias: subjectRef });
    } else {
      // si no se seleccionó materia, busco las materias del curso y voy armando el objeto cursos
      const matRef = await getSubCollectionRef(referenciaACurso, 'materias');

      const mat = await matRef.get();
      mat.forEach((materia) => {
        const materiaRef = admin.firestore().doc(
          `${referenciaACurso}/materias/${materia.id}`
        );
        subjectRef.push(materiaRef);
      });

      cursosObj.push({ curso_id: courseRef, materias: subjectRef });
    }
  } else {
    // si no se seleccionó curso, traigo todos los cursos de la institución y para curso las materias
    const cursosRef = await getSubCollectionRef(referenciaAInst, 'cursos');
    console.log(cursosRef);
    const arrayCursos = await getSubCollectionIds(cursosRef);

    for (const curso of arrayCursos) {
      let arrayMaterias = [];
      const refACurso = `${referenciaAInst}/cursos/${curso}`;
      const materiaRef = getSubCollectionRef(refACurso, 'materias');
      const materias = await materiaRef.get();

      materias.forEach((mat) => {
        const materiaRef = admin.firestore().doc(
          `${refACurso}/materias/${mat.id}`
        );
        arrayMaterias.push(materiaRef);
      });
      const cursoRef = await getDocRef(refACurso);

      const cursoObj = {
        curso_id: cursoRef,
        materias: arrayMaterias,
      };

      cursosObj.push(cursoObj);
    }
  }

  // armo el objeto final de instituciones del usuario
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
    console.log(instObj.cursos);
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
