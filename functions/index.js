/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const cors = require('cors')({ origin: true });
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
exports.register = functions.auth.user().onCreate((data) => {
  const user = {
    id: data.uid,
    mail: data.email,
    fecha_creacion: data.metadata.creationTime,
    nombre: '',
    apellido: '',
    telefono: '',
    primerLogin: true,
    cambiarPassword: false,
    instituciones: [],
    rol: 0,
  }

  return admin.firestore().collection('usuarios')
    .doc(data.uid)
    .set(user)
    .then(doc => console.log('user added', doc))
});

const authErrorMessage = (error) => {
  switch (error) {
    case 'The email address is already in use by another account.':
      return 'Este correo ya está siendo usado por otro usuario.';
    default:
      return error;
  }
};

exports.user = functions.https.onCall((data) => {
  return admin.auth().createUser(data)
    .catch((error) => {
      const errorMessage = authErrorMessage(error.message);
      throw new functions.https.HttpsError('internal', errorMessage)
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


exports.asignarFuncion = async ({ instId, courseId, subjectId, uid }) => {
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

  //await this.agregarAUsusariosPorMateria(subjectId, uid);

  return instObj;
}

exports.asignarMaterias = functions.https.onCall(async (data) => {
  try {
    const instObj = await this.asignarFuncion(data);
    console.log(instObj);
    //TODO iterar instObj y agregar a usuarios por materia
    await this.agregarAUsusariosPorMateria(instObj, data.uid);
    await admin.firestore().collection('usuarios')
      .doc(data.uid)
      .set({ instituciones: instObj }, { merge: true });

  } catch (error) {
    console.log('error', error);
  }

});

exports.institucionesUsuario = async ({ uid }) => {
  const userRef = admin.firestore().collection('usuarios').doc(uid);
  const userDoc = await userRef.get();
  const userObj = userDoc.data();
  const { instituciones } = userObj;
  return instituciones;
}

exports.mergeInstituciones = async (instUser, instAsignar) => {
  const [institucionAsignar] = instAsignar;

  const institucionYaAsignada = instUser.find(institucion => institucion.institucion_id.isEqual(institucionAsignar.institucion_id));

  // La que voy a asignar es nueva (no está dentro de instUser)
  if (!institucionYaAsignada) {
    return [...instUser, ...instAsignar]
  }

  // El usuario ya posee la institución a la cual lo invitaron
  const { cursos } = institucionYaAsignada;

  // Para cada curso que voy a asignar, pregunto si ya lo posee asignado
  institucionAsignar.cursos.forEach(cursoAsignar => {
    const cursoYaAsignado = cursos.find(curso => curso.curso_id.isEqual(cursoAsignar.curso_id));

    if (!cursoYaAsignado) {
      return cursos.push(cursoAsignar);
    }

    const { materias } = cursoYaAsignado;

    cursoAsignar.materias.forEach(materiaAsignar => {
      const materiaYaAsignada = materias.find(materia => materia.isEqual(materiaAsignar))

      if (!materiaYaAsignada) {
        materias.push(materiaAsignar);
        return;
      }

    })

  })

  return instUser;
}

exports.agregarMaterias = functions.https.onCall(async (data) => {

  try {
    const instUser = await this.institucionesUsuario(data);
    const instAsignar = await this.asignarFuncion(data);
    const instituciones = await this.mergeInstituciones(instUser, instAsignar);
    //TODO iterar instObj y agregar a usuarios por materia
    await this.agregarAUsusariosPorMateria(instAsignar, data.uid);
    await admin.firestore().collection('usuarios')
      .doc(data.uid)
      .update({ instituciones });
  } catch (error) {
    console.log('error', error);
  }

});

exports.agregarAUsusariosPorMateria = async (instituciones, userId) => {
  try {
    for (const institucion of instituciones) {
      for (const curso of institucion.cursos) {
        for (const materiaRef of curso.materias) {
          let usuario_id = [];
          const materiaSnapShot = await materiaRef.get();
          const usuariosPorMateriaRef = admin.firestore().collection('usuariosPorMateria').doc(materiaSnapShot.id);
          const usuariosPorMateria = await usuariosPorMateriaRef.get();
          const usuariosPorMateriaObj = usuariosPorMateria.data();

          if (usuariosPorMateriaObj !== undefined) {
            usuario_id = usuariosPorMateriaObj.usuario_id;
          }
          usuario_id.push(userId);
          await admin.firestore().collection('usuariosPorMateria').doc(materiaSnapShot.id).set({ usuario_id: usuario_id }, { merge: true });
        }
      }
    }
  } catch (error) {
    console.log('error', error);
  }

};


let transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'trida.app@gmail.com',
    pass: 'tr1d@@pp'
  }
}));

exports.sendMail = functions.https.onCall((data) => {
  const { email, subject, html } = data;

  const mailOptions = {
    from: 'Trida App <trida.app@gmail.com>',
    to: email,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
});


const createNotification = async (notification, users) => {
  try {

    users.forEach(async user => {
      await admin.firestore().collection(`notificaciones/${user}/listado`)
        .add(notification);
    });

  } catch (error) {
    console.log(error);
  }
}

exports.messageRecived = functions.firestore
  .document('mensajes/{mensajeId}')
  .onCreate((doc) => {
    try {
      const message = doc.data();
      const notification = {
        contenido: `Tenés un nuevo mensaje de ${message.emisor.nombre}`,
        fecha: admin.firestore.FieldValue.serverTimestamp(),
        url: `/app/comunicaciones/mensajeria`,
        leida: false
      }

      return createNotification(notification, message.receptor);
    } catch (error) {
      console.log('error', error);
    }
  })

exports.foroCreated = functions.firestore
  .document('foros/{foroId}')
  .onCreate(async (doc) => {
    try {
      const foro = doc.data();
      const foroId = doc.id;
      const notification = {
        contenido: `Se ha creado el foro ${foro.nombre}`,
        fecha: admin.firestore.FieldValue.serverTimestamp(),
        url: `/app/comunicaciones/foro/detalle-foro/${foroId}`,
        leida: false
      };

      const usuariosPorMateriaRef = admin.firestore().collection('usuariosPorMateria').doc(foro.idMateria);
      const usuariosPorMateria = await usuariosPorMateriaRef.get();
      const usuariosPorMateriaObj = usuariosPorMateria.data();

      const alumnos = usuariosPorMateriaObj.usuario_id.filter(item => item !== foro.creador);

      return createNotification(notification, alumnos);
    } catch (error) {
      console.log('error', error);
    }
  })

exports.classCreated = functions.firestore
  .document('clases/{claseId}')
  .onCreate(async (doc) => {
    try {
      const clase = doc.data();
      const claseId = doc.id;
      const notification = {
        contenido: `Se ha creado la clase ${clase.nombre}`,
        fecha: admin.firestore.FieldValue.serverTimestamp(),
        url: `/app/clases-virtuales/mis-clases/detalle-clase/${claseId}`,
        leida: false
      };

      const usuariosPorMateriaRef = admin.firestore().collection('usuariosPorMateria').doc(clase.idMateria);
      const usuariosPorMateria = await usuariosPorMateriaRef.get();
      const usuariosPorMateriaObj = usuariosPorMateria.data();

      const alumnos = usuariosPorMateriaObj.usuario_id.filter(item => item !== clase.creador);

      return createNotification(notification, alumnos);
    } catch (error) {
      console.log('error', error);
    }
  })

exports.correctionCreated = functions.firestore
  .document('correcciones/{correccionId}')
  .onCreate(async (doc) => {
    try {
      const correccion = doc.data();
      const correccionId = doc.id;

      const usuarioRef = admin.firestore().collection('usuarios').doc(correccion.creador);
      const usuario = await usuarioRef.get();
      const usuarioObj = usuario.data();

      const notification = {
        contenido: `${usuarioObj.nombre} ha entregado una ${correccion.tipo}`,
        fecha: admin.firestore.FieldValue.serverTimestamp(),
        url: `/app/correcciones#${correccionId}`,
        leida: false
      };

      const usuariosPorMateriaRef = admin.firestore().collection('usuariosPorMateria').doc(correccion.idMateria);
      const usuariosPorMateria = await usuariosPorMateriaRef.get();
      const usuariosPorMateriaObj = usuariosPorMateria.data();

      let docentes = [];
      for (const usu of usuariosPorMateriaObj.usuario_id) {
        const usuarioRef = admin.firestore().collection('usuarios').doc(usu);
        const usuario = await usuarioRef.get();
        const usuarioObj = usuario.data();
        if (usuarioObj.rol === 1)
          docentes.push(usu);
      }

      return createNotification(notification, docentes);
    } catch (error) {
      console.log('error', error);
    }
  })

exports.contentCreated = functions.storage
  .object().onFinalize(async (object) => {
    try {
      const filePath = object.name; // File path in the bucket.

      //Si están subiendo algo en contenidos, envío la notificación a los usuarios.
      if (filePath.includes('contenidos')) {
        const values = filePath.split('/');
        const usuariosPorMateriaRef = admin.firestore().collection('usuariosPorMateria').doc(values[1]);
        const usuariosPorMateria = await usuariosPorMateriaRef.get();
        const usuariosPorMateriaObj = usuariosPorMateria.data();
  
        let alumnos = [];
        for (const usu of usuariosPorMateriaObj.usuario_id) {
          const usuarioRef = admin.firestore().collection('usuarios').doc(usu);
          const usuario = await usuarioRef.get();
          const usuarioObj = usuario.data();
          if (usuarioObj.rol === 2)
            alumnos.push(usu);
        }

        const notification = {
          contenido: `Se han cargado nuevos contenidos`,
          fecha: admin.firestore.FieldValue.serverTimestamp(),
          url: `/app/contenidos`,
          leida: false
        };

        return createNotification(notification, alumnos);
      }
    } catch (error) {
      console.log('error', error);
    }
  });
