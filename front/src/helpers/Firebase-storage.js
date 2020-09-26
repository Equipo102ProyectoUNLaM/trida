import { storage } from 'helpers/Firebase';
import { enviarNotificacionError } from 'helpers/Utils-ui';
import Moment from 'moment';

export const BaseUrl = 'gs://trida-7f28f.appspot.com/';

export const buscarArchivosStorage = async (subjectId, newRef) => {
  let arrayFiles = [];

  try {
    //Obtenemos la referencia de la carpeta que quiero listar (La de la materia)
    const listRef = newRef || storage.ref(subjectId + '/contenidos');
    // Obtenemos las referencias de carpetas y archivos
    const result = await listRef.listAll();

    //Carpetas
    for (const folderRef of result.prefixes) {
      const subFolderElements = await buscarArchivosStorage(
        subjectId,
        folderRef
      );

      if (!newRef) {
        arrayFiles = [...arrayFiles, ...subFolderElements];
      }
    }

    //Archivos
    for (const fileRef of result.items) {
      const metadata = await fileRef.getMetadata();
      const url = await fileRef.getDownloadURL();

      const obj = {
        key: metadata.fullPath.replace(subjectId + '/contenidos/', ''),
        modified: Moment(metadata.updated),
        size: metadata.size,
        url: url,
      };

      arrayFiles.push(obj);
    }

    return arrayFiles;
  } catch (err) {
    enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
  }
};

export const subirArchivoAStorage = async (path, file) => {
  const listRef = storage.ref(`${path}/${file.name}`);
  return await listRef.put(file).then(async (snapshot) => {
    return await snapshot.ref.getDownloadURL().then(async (url) => {
      return url;
    });
  });
};

export const eliminarArchivoStorage = async (path) => {
  const fileRef = storage.ref(path);
  fileRef.delete().catch(function (error) {
    enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
  });
};
