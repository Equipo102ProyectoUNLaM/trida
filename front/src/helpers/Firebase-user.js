import { getDocument } from 'helpers/Firebase-db';

export const getInstitucionesDeUsuario = async (userId) => {
  const array = [];
  try {
    const userRef = await getDocument(`usuarios/${userId}`);
    const { data } = userRef;
    const { instituciones } = data;
    if (!instituciones) return;
    for (const inst of instituciones) {
      const institutionRef = await getDocument(`${inst.institucion_id.path}`);
      const { data } = institutionRef;
      const { nombre, niveles } = data;
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
