import { firestore } from './Firebase';
import {
  enviarNotificacionError,
  enviarNotificacionExitosa,
} from 'helpers/Utils-ui';
import { getFechaHoraActual } from 'helpers/Utils';
import moment from 'moment';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';

firestore.enablePersistence().catch(function (err) {
  console.log(err);
});

// trae una colección
// parámetro: colección obligatora
// tiene parámetros opcionales para realizar un WHERE:
//    array de objetos con campo a filtrar, operador y id a comparar, se puede agregar cualquier cantidad
// tiene parámetros opcionales para realizar un ORDER BY:
//    recibe un objeto con el campo a ordenar y condición de ordenamiento
// devuelve un array de los documentos de la colección formateados en un objeto
// con id y data (objeto con los datos del documento)
export async function getCollection(collection, filterBy, orderBy) {
  const arrayDeObjetos = [];
  let collectionRef = firestore.collection(collection);

  (filterBy || []).forEach(({ field, operator, id }) => {
    collectionRef = collectionRef.where(field, operator, id);
  });

  (orderBy || []).forEach(({ order, orderCond }) => {
    collectionRef = collectionRef.orderBy(order, orderCond);
  });
  try {
    var allClasesSnapShot = await collectionRef.get();
    allClasesSnapShot.forEach((doc) => {
      const docId = doc.id;
      const obj = {
        id: docId,
        data: doc.data(),
      };
      arrayDeObjetos.push(obj);
    });
  } catch (err) {
    console.log(err); //Este console es por si el error que tira es para agregar el índice.
    enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
  } finally {
    return arrayDeObjetos;
  }
}

// trae una colección con una subcoleccion
// parámetro: colección obligatora
// tiene parámetros opcionales para realizar un WHERE:
//    array de objetos con campo a filtrar, operador y id a comparar, se puede agregar cualquier cantidad
// tiene parámetros opcionales para realizar un ORDER BY:
//    recibe un objeto con el campo a ordenar y condición de ordenamiento
// devuelve un array de los documentos de la colección formateados en un objeto
// con id y data (objeto con los datos del documento)
export async function getCollectionWithSubCollections(
  collection,
  filterBy,
  orderBy,
  subCollection
) {
  const arrayDeObjetos = [];
  let collectionRef = firestore.collection(collection);

  (filterBy || []).forEach(({ field, operator, id }) => {
    collectionRef = collectionRef.where(field, operator, id);
  });

  if (orderBy) {
    collectionRef = collectionRef.orderBy(orderBy.order, orderBy.orderCond);
  }

  try {
    var allClasesSnapShot = await collectionRef.get();
    allClasesSnapShot.forEach(async (doc) => {
      let docId = doc.id;
      let obj = {
        id: docId,
        data: {
          base: doc.data(),
          subcollections: [],
        },
      };
      arrayDeObjetos.push(obj);
    });
  } catch (err) {
    enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
  }

  for (const obj of arrayDeObjetos) {
    let subCollectionRef = firestore
      .collection(collection)
      .doc(obj.id)
      .collection(subCollection);
    let arrayDeSubcolecciones = [];
    try {
      let subCollectionSnapshot = await subCollectionRef.get();
      subCollectionSnapshot.forEach((doc) => {
        let scolId = doc.id;
        let scol = {
          id: scolId,
          data: doc.data(),
        };
        arrayDeSubcolecciones.push(scol);
      });
    } catch (err) {
      enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
    }
    obj.data.subcollections = arrayDeSubcolecciones;
  }

  return arrayDeObjetos;
}

// trae un documento en formato objeto (id + data (objeto con datos del documento))
// parámetro: referencia al documento
export const getDocument = async (docRef) => {
  const ref = await firestore.doc(docRef);
  try {
    const refSnapShot = await ref.get();
    const docId = refSnapShot.id;
    return { id: docId, data: refSnapShot.data() };
  } catch (err) {
    console.log(err);
    enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
  }
};

// trae una referencia a un documento
// parámetro: referencia al documento
export const getDocumentRef = (docRef) => {
  return firestore.doc(docRef);
};

// trae un documento en formato objeto (id + data (objeto con datos del documento))
// junto con la coleccion interior
// parámetro: referencia al documento y nombre de la sub coleccion
export const getDocumentWithSubCollection = async (
  docRef,
  subCollection,
  orderBy = false
) => {
  try {
    const docObj = await getDocument(docRef);
    const { id, data } = docObj;
    const subColObj = await getCollection(
      docRef + '/' + subCollection,
      false,
      orderBy
    );
    return { id: id, data: data, subCollection: subColObj };
  } catch (err) {
    enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
  }
};

export const getUsernameById = async (id) => {
  let docObj = await getDocument(`usuarios/${id}`);
  let { data } = docObj;
  return data.nombre + ' ' + data.apellido;
};

// agrega un documento
// parámetros: colección, objeto a agregar y reemplazo para mostrar en la notificación
export const addDocument = async (
  collection,
  object,
  userId,
  mensajePrincipal,
  mensajeSecundario,
  mensajeError
) => {
  object = {
    ...object,
    fecha_creacion: getFechaHoraActual(),
    activo: true,
    creador: userId,
  };

  try {
    const docRef = await firestore.collection(collection).add(object);
    if (mensajePrincipal) {
      enviarNotificacionExitosa(mensajeSecundario, mensajePrincipal);
    }
    return docRef;
  } catch (error) {
    if (mensajePrincipal) {
      enviarNotificacionError(mensajeError, 'Ups!');
    }
  }
};

// agrega un documento con una subcoleccion
// parámetros: colección, objeto a agregar (debe tener el parametro subcollection con "name" y "data") y reemplazo para mostrar en la notificación
export const addDocumentWithSubcollection = async (
  collection,
  object,
  userId,
  message,
  subCollection,
  subCollectionMessage,
  idDoc
) => {
  let objectSubcollectionData = object.subcollection.data;
  let objectBaseData = {
    ...object,
    fecha_creacion: getFechaHoraActual(),
    activo: true,
    creador: userId,
  };
  delete objectBaseData.subcollection;

  firestore
    .collection(collection)
    .doc(idDoc)
    .set(objectBaseData)
    .then(function (docRef) {
      for (const data of objectSubcollectionData) {
        firestore
          .collection(collection)
          .doc(idDoc)
          .collection(subCollection)
          .add(data)
          .then(function () {})
          .catch(function (error) {
            enviarNotificacionError(
              `Error al agregar ${subCollectionMessage}`,
              'Ups!'
            );
          });
      }
      enviarNotificacionExitosa(
        `${message} agregada exitosamente`,
        `${message} agregada!`
      );
    });
};

export const addToSubCollection = async (
  collection,
  doc,
  subcollection,
  object,
  userId,
  mensajePrincipal,
  mensajeSecundario,
  mensajeError
) => {
  object = {
    ...object,
    fecha_creacion: getFechaHoraActual(),
    activo: true,
    creador: userId,
  };

  try {
    const docRef = await firestore
      .collection(collection)
      .doc(doc)
      .collection(subcollection)
      .add(object);
    if (mensajePrincipal) {
      enviarNotificacionExitosa(mensajeSecundario, mensajePrincipal);
    }
    return docRef;
  } catch (error) {
    console.log(error);
    if (mensajePrincipal) {
      enviarNotificacionError(mensajeError, 'Ups!');
    }
  }
};

/*  Este metodo es idéntico a addToSubCollection, solo que espera un array de objetos.
    Itera por cada objeto y crea un documento por cada uno  */
export const addArrayToSubCollection = async (
  collection,
  doc,
  subcollection,
  object,
  userId,
  mensajePrincipal,
  mensajeSecundario,
  mensajeError
) => {
  let objectSubcollectionData = object.subcollection.data;
  let objectBaseData = {
    ...object,
    fecha_creacion: getFechaHoraActual(),
    activo: true,
    creador: userId,
  };
  delete objectBaseData.subcollection;

  for (const data of objectSubcollectionData) {
    firestore
      .collection(collection)
      .doc(doc)
      .collection(subcollection)
      .add(data)
      .then(function () {})
      .catch(function (error) {
        enviarNotificacionError(`Error al agregar ${mensajeError}`, 'Ups!');
      });
  }
  enviarNotificacionExitosa(
    `${mensajeSecundario} agregadas exitosamente`,
    `${mensajePrincipal} agregadas!`
  );
};

export const addToMateriasCollection = async (
  docInst,
  docCurso,
  object,
  userId,
  mensajePrincipal,
  mensajeSecundario,
  mensajeError
) => {
  object = {
    ...object,
    fecha_creacion: getFechaHoraActual(),
    activo: true,
    creador: userId,
  };

  try {
    const docRef = await firestore
      .collection('instituciones')
      .doc(docInst)
      .collection('cursos')
      .doc(docCurso)
      .collection('materias')
      .add(object);
    if (mensajePrincipal) {
      enviarNotificacionExitosa(mensajeSecundario, mensajePrincipal);
    }
    return docRef;
  } catch (error) {
    if (mensajePrincipal) {
      enviarNotificacionError(mensajeError, 'Ups!');
    }
  }
};

export const addDocumentWithId = async (collection, id, object, message) => {
  object = {
    ...object,
    fecha_creacion: getFechaHoraActual(),
    activo: true,
    creador: id,
  };

  firestore
    .collection(collection)
    .doc(id)
    .set(object)
    .then(function () {
      if (message) {
        enviarNotificacionExitosa(
          `${message} agregada exitosamente`,
          `${message} agregada!`
        );
      }
    })
    .catch(function (error) {
      if (message) {
        enviarNotificacionError(`Error al agregar ${message}`, 'Ups!');
      }
      enviarNotificacionExitosa(`${message}`, `${message}!`);
    })
    .catch(function (error) {
      enviarNotificacionError(`${message}`, 'Ups!');
    });
};

// edita un documento
// parámetros: colección, id del documento, objeto a editar y reemplazo para mostrar en la notificación
export const editDocument = async (collection, docId, obj, message) => {
  obj = {
    ...obj,
    fecha_edicion: getFechaHoraActual(),
  };
  try {
    const ref = firestore.collection(collection).doc(docId);
    await ref.set(obj, { merge: true });
  } catch (error) {
    console.log(error);
  }

  if (message) {
    enviarNotificacionExitosa(`${message} exitosamente`, `${message}!`);
  }
};

// borra un documento
// parámetros: colección, id de documento y reemplazo para mostrar en la notificación
export const deleteDocument = async (collection, document, message) => {
  const docRef = firestore.collection(collection).doc(document);
  try {
    await docRef.delete();
  } catch (err) {
    enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
  } finally {
    if (message)
      enviarNotificacionExitosa(
        `${message} borrada exitosamente`,
        `${message} borrada!`
      );
  }
};

export const logicDeleteDocument = async (collection, docId, message) => {
  var ref = firestore.collection(collection).doc(docId);
  try {
    ref.set({ activo: false }, { merge: true });
    enviarNotificacionExitosa(
      `${message} borrada exitosamente`,
      `${message} borrada!`
    );
  } catch (err) {
    enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
  }
};

export const getEventos = async (subject, user) => {
  let arrayDeEventos = [];
  const arrayDeClases = await getCollection('clases', [
    { field: 'idMateria', operator: '==', id: subject },
    { field: 'activo', operator: '==', id: true },
  ]);
  const arrayDeEvaluaciones = await getCollection('evaluaciones', [
    { field: 'idMateria', operator: '==', id: subject },
    { field: 'activo', operator: '==', id: true },
  ]);
  const arrayDeEvaluacionesOrales = await getCollection('evaluacionesOrales', [
    { field: 'idMateria', operator: '==', id: subject },
    { field: 'activo', operator: '==', id: true },
    {
      field: 'integrantes',
      operator: 'array-contains',
      id: user,
    },
  ]);
  const arrayDePracticas = await getCollection('practicas', [
    { field: 'idMateria', operator: '==', id: subject },
    { field: 'activo', operator: '==', id: true },
  ]);
  arrayDeClases.forEach((clase) => {
    const { id, data } = clase;
    arrayDeEventos.push({
      id,
      tipo: 'clase',
      url: `clases-virtuales/mis-clases/detalle-clase/${id}`,
      title: 'Clase: ' + data.nombre,
      start: new Date(data.fecha_clase.toDate()),
      end: new Date(data.fecha_clase.toDate()),
    });
  });
  arrayDeEvaluaciones.forEach((prueba) => {
    const { id, data } = prueba;
    const nombre = CryptoJS.AES.decrypt(data.nombre, secretKey).toString(
      CryptoJS.enc.Utf8
    );
    arrayDeEventos.push({
      id,
      tipo: 'evaluacion',
      url: 'evaluaciones/escritas',
      title: 'Evaluación: ' + nombre,
      start: new Date(data.fecha_publicacion.toDate()),
      end: new Date(data.fecha_finalizacion.toDate()),
    });
  });
  arrayDeEvaluacionesOrales.forEach((oral) => {
    const { id, data } = oral;
    const nombre = data.nombre;
    arrayDeEventos.push({
      id,
      tipo: 'evaluacionOral',
      url: 'evaluaciones/orales',
      title: 'Evaluación Oral: ' + nombre,
      start: new Date(data.fecha_evaluacion.toDate()),
      end: new Date(data.fecha_evaluacion.toDate()),
    });
  });
  arrayDePracticas.forEach((practica) => {
    const { id, data } = practica;
    arrayDeEventos.push({
      id,
      tipo: 'practica',
      url: 'practicas',
      title: 'Práctica: ' + data.nombre,
      start: new Date(data.fechaLanzada.toDate()),
      end: new Date(data.fechaVencimiento.toDate()),
    });
  });

  return arrayDeEventos;
};

export const getEventosDelDia = async (subject, user) => {
  const arrayEventos = await getEventos(subject, user);
  const arrayEventosDia = arrayEventos.filter((evento) => {
    const { start, end } = evento;
    const inicio = moment(new Date(start)).format('YYYY-MM-DD');
    const fin = moment(new Date(end)).format('YYYY-MM-DD');
    return (
      inicio === moment().format('YYYY-MM-DD') ||
      fin === moment().format('YYYY-MM-DD')
    );
  });

  return arrayEventosDia;
};

export const guardarNotas = async (user, notas) => {
  return await firestore
    .collection('notas')
    .doc(user)
    .set({ notas: notas }, { merge: true });
};

export const getDocumentOnSnapshot = (collection, document, callback) => {
  return firestore.collection(collection).doc(document).onSnapshot(callback);
};

export const getCollectionOnSnapshot = async (collection, callback) => {
  return await firestore.collection(collection).onSnapshot(callback);
};

export const getCollectionOnSnapshotOrderedAndLimited = async (
  collection,
  callback,
  orderBy,
  order,
  limit
) => {
  return await firestore
    .collection(collection)
    .orderBy(orderBy, order)
    .limit(limit)
    .onSnapshot(callback);
};

export const generateId = (path) => {
  return firestore.collection(path).doc().id;
};

export const documentExistsOnSnapshot = (collection, document) => {
  const usersRef = firestore.collection(collection).doc(document);

  return usersRef.get().then((docSnapshot) => {
    //si por algún motivo queremos tener la rta completa, devolver un docSnapshot.data()
    if (docSnapshot.exists) {
      usersRef.onSnapshot((doc) => {
        return true;
      });
    } else {
      return false;
    }
  });
};
