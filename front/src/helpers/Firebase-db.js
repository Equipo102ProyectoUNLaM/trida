import { firestore } from './Firebase';
import { NotificationManager } from 'components/common/react-notifications';

// trae una colección
// parámetro: colección obligatora
// tiene parámetros opcionales para realizar un WHERE (campo a filtrar, operador y id a comparar)
// tiene parámetros opcionales para realizar un ORDER BY (campo a ordenar y condición de ordenamiento), atado al WHERE
// devuelve un array de los documentos de la colección formateados en un objeto
// con id y data (objeto con los datos del documento)
export async function getCollection(
  collection,
  field,
  operator,
  id,
  order,
  orderCond
) {
  const arrayDeObjetos = [];
  let collectionRef = firestore.collection(collection);
  if (arguments.length > 1 && arguments.length <= 4) {
    collectionRef = collectionRef.where(field, operator, id);
  }
  if (arguments.length > 4) {
    collectionRef = collectionRef
      .where(field, operator, id)
      .orderBy(order, orderCond);
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
        `${message} agregada!`,
        `${message} agregada exitosamente`,
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
    `${message} editada!`,
    `${message} editada exitosamente`,
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
      `${message} borrada!`,
      `${message} borrada exitosamente`,
      3000,
      null,
      null,
      ''
    );
  }
};
