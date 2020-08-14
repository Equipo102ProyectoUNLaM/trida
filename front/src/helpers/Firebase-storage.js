import { storage } from 'helpers/Firebase';
import Moment from 'moment';

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
    console.log('Error getting documents', err);
  }
};
