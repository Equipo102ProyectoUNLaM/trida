import { firestore } from './Firebase';
import { NotificationManager } from 'components/common/react-notifications';
import { getFechaHoraActual } from 'helpers/Utils';

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

  if (orderBy) {
    collectionRef = collectionRef.orderBy(orderBy.order, orderBy.orderCond);
  }

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
    console.log('Error getting documents', err);
  } finally {
    return arrayDeObjetos;
  }
}

// trae un documento en formato objeto (id + data (objeto con datos del documento))
// parámetro: referencia al documento
export const getDocument = async (docRef) => {
  const ref = firestore.doc(docRef);
  try {
    const refSnapShot = await ref.get();
    const docId = refSnapShot.id;
    return { id: docId, data: refSnapShot.data() };
  } catch (err) {
    console.log('Error getting documents', err);
  }
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

  firestore
    .collection(collection)
    .add(object)
    .then(function () {
      if (mensajePrincipal) {
        NotificationManager.success(
          `${mensajeSecundario}`,
          `${mensajePrincipal}`,
          3000,
          null,
          null,
          ''
        );
      }
    })
    .catch(function (error) {
      if (mensajePrincipal) {
        NotificationManager.error(
          `${mensajeError}`,
          error,
          3000,
          null,
          null,
          ''
        );
      }
    });
};

export const addDocumentWithId = async (collection, id, object, message) => {
  firestore
    .collection(collection)
    .doc(id)
    .set(object)
    .then(function () {
      if (message) {
        NotificationManager.success(
          `${message} agregada exitosamente`,
          `${message} agregada!`,
          3000,
          null,
          null,
          ''
        );
      }
    })
    .catch(function (error) {
      if (message) {
        NotificationManager.error(
          `Error al agregar ${message}`,
          error,
          3000,
          null,
          null,
          ''
        );
      }
      NotificationManager.success(
        `${message}`,
        `${message}!`,
        3000,
        null,
        null,
        ''
      );
    })
    .catch(function (error) {
      NotificationManager.error(`${message}`, error, 3000, null, null, '');
    });
};

// edita un documento
// parámetros: colección, id del documento, objeto a editar y reemplazo para mostrar en la notificación
export const editDocument = async (collection, docId, obj, message) => {
  obj = {
    ...obj,
    fecha_edicion: getFechaHoraActual(),
  };

  var ref = firestore.collection(collection).doc(docId);
  ref.set(obj, { merge: true });

  if (message) {
    NotificationManager.success(
      `${message} editada exitosamente`,
      `${message} editada!`,
      3000,
      null,
      null,
      ''
    );
  }
};

// borra un documento
// parámetros: colección, id de documento y reemplazo para mostrar en la notificación
export const deleteDocument = async (collection, document, message) => {
  const docRef = firestore.collection(collection).doc(document);
  try {
    await docRef.delete();
  } catch (err) {
    console.log('Error deleting documents', err);
  } finally {
    NotificationManager.success(
      `${message} borrada exitosamente`,
      `${message} borrada!`,
      3000,
      null,
      null,
      ''
    );
  }
};

export const logicDeleteDocument = async (collection, docId, message) => {
  var ref = firestore.collection(collection).doc(docId);
  try {
    ref.set({ activo: false }, { merge: true });
  } catch (err) {
    console.log('Error borrando documentos', err);
  } finally {
    NotificationManager.success(
      `${message} borrada exitosamente`,
      `${message} borrada!`,
      3000,
      null,
      null,
      ''
    );
  }
};
