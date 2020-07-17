import { firestore } from './Firebase';
import { NotificationManager } from 'components/common/react-notifications';

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
export const addDocument = async (collection, object, message) => {
  firestore
    .collection(collection)
    .add(object)
    .then(function () {
      NotificationManager.success(
        `${message} agregada exitosamente`,
        `${message} agregada!`,
        3000,
        null,
        null,
        ''
      );
    })
    .catch(function (error) {
      NotificationManager.error(
        `Error al agregar ${message}`,
        error,
        3000,
        null,
        null,
        ''
      );
    });
};

// edita un documento
// parámetros: colección, id del documento, objeto a editar y reemplazo para mostrar en la notificación
export const editDocument = async (collection, docId, obj, message) => {
  var ref = firestore.collection(collection).doc(docId);
  ref.set(obj, { merge: true });

  NotificationManager.success(
    `${message} editada exitosamente`,
    `${message} editada!`,
    3000,
    null,
    null,
    ''
  );
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