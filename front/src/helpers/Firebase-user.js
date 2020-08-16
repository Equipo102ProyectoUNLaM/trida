import { firestore, storage } from 'helpers/Firebase';
import { getDocument } from 'helpers/Firebase-db';

export const getUserData = async (userId) => {
  try {
    const { data } = await getDocument(`usuarios/${userId}`);
    const foto = await storage.ref('usuarios').child(userId).getDownloadURL();

    return {
      ...data,
      foto,
    };
  } catch (err) {
    console.log('Error getting users document', err);
  }
};

export const getInstituciones = async (userId) => {
  const array = [];
  try {
    const userRef = await firestore.doc(`usuarios/${userId}`);

    var userDoc = await userRef.get();
    const { instituciones } = await userDoc.data();
    if (!instituciones) return;
    for (const inst of instituciones) {
      const institutionRef = await firestore.doc(`${inst.institucion_id.path}`);
      var institutionDoc = await institutionRef.get();
      const { nombre, niveles } = institutionDoc.data();
      const obj = {
        id: inst.institucion_id.id,
        name: nombre,
        tags: niveles,
      };
      array.push(obj);
    }
  } catch (err) {
    console.log('Error getting documents', err);
  } finally {
    return array;
  }
};

export const renderSubjects = async (materiasIds) => {
  const array = [];
  try {
    for (const m of materiasIds) {
      //Busco los documentos de las materias y me traigo la info
      const matRef = await firestore.doc(`${m.path}`);
      var matDoc = await matRef.get();
      const { nombre } = await matDoc.data();
      const obj = {
        id: m.id,
        name: nombre,
      };
      array.push(obj);
    }
    return array;
  } catch (err) {
    console.log('Error getting documents', err);
  }
};

export const getCourses = async (institutionId, userId) => {
  var array = [];
  try {
    const userRef = await firestore.doc(`usuarios/${userId}`);
    var userDoc = await userRef.get();
    const { instituciones } = await userDoc.data(); //Traigo las instituciones del usuario
    var instf = instituciones.filter(
      (i) => i.institucion_id.id === institutionId
    ); //Busco la que seleccionó anteriormente
    for (const c of instf[0].cursos) {
      //Itero en sus cursos, me traigo toda la info del documento
      const courseRef = await firestore.doc(`${c.curso_id.path}`);
      var courseDoc = await courseRef.get();
      const { nombre } = await courseDoc.data();
      var subjects_with_data = await renderSubjects(c.materias); //Busco las materias que tiene asignadas
      const obj = {
        id: c.curso_id.id,
        subjects: subjects_with_data,
        name: nombre,
      };
      array.push(obj); //Armo el array con la info del curso y las materias
    }
    return array;
  } catch (err) {
    console.log('Error getting documents', err);
  }
};
