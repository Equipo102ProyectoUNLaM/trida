import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, Button } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import FileBrowser, { Icons } from 'react-keyed-file-browser';
import { storage } from 'helpers/Firebase';
import Moment from 'moment';
import '../../../../node_modules/react-keyed-file-browser/dist/react-keyed-file-browser.css';
import Dropzone from '../../../containers/forms/Dropzone';
import { Colxx } from '../../../components/common/CustomBootstrap';
import { NotificationManager } from '../../../components/common/react-notifications';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';

class Contenidos extends Component {
  constructor(props) {
    super(props);
    var subject = JSON.parse(localStorage.getItem('subject'));
    this.state = {
      files: [],
      isLoading: true,
      canSubmitFiles: true, //boton inhabilitado
      dropZone: [],
      subjectId: subject.id,
      modalRenameOpen: false,
      repeatedFiles: [],
    };
    this.listFolderItems = this.listFolderItems.bind(this);
    this.dropZoneRef = React.createRef();
  }

  // Esto va a hacer el get del storage para la materia
  getContenidos = async () => {
    await this.dataListRenderer();
  };

  async componentDidMount() {
    await this.getContenidos();
  }

  async dataListRenderer() {
    var array = [];
    try {
      //Obtenemos la referencia de la carpeta que quiero listar (La de la materia)
      var listRef = storage.ref(this.state.subjectId);
      // Obtenemos las referencias de carpetas y archivos
      await listRef.listAll().then(async (result) => {
        //Carpetas
        for (const folderRef of result.prefixes) {
          //Listamos archivos de cada carpeta
          var subFolderElements = await this.listFolderItems(
            folderRef,
            this.state.subjectId
          );
          array = array.concat(subFolderElements);
        }
        //Archivos
        for (const res of result.items) {
          await res.getMetadata().then(async (metadata) => {
            await res.getDownloadURL().then(async (url) => {
              var obj = {
                key: metadata.fullPath.replace(this.state.subjectId + '/', ''),
                modified: Moment(metadata.updated),
                size: metadata.size,
                url: url,
                fullPathOrigin: metadata.fullPath,
              };
              array.push(obj);
            });
          });
        }
      });
    } catch (err) {
      console.log('Error getting documents', err);
    } finally {
      this.setState((state) => ({
        files: array,
        isLoading: false,
      }));
      console.log(this.state.files);
    }
  }

  async listFolderItems(ref, subjectId) {
    var array = [];
    try {
      await ref.listAll().then(async (result) => {
        //Carpetas
        for (const folderRef of result.prefixes) {
          var subFolderElements = await this.listFolderItems(
            folderRef,
            subjectId
          );
          array = array.concat(subFolderElements);
        }
        //Archivos
        for (const res of result.items) {
          await res.getMetadata().then(async (metadata) => {
            await res.getDownloadURL().then(async (url) => {
              var obj = {
                key: metadata.fullPath.replace(subjectId + '/', ''),
                modified: Moment(metadata.updated),
                size: metadata.size,
                url: url,
                fullPathOrigin: metadata.fullPath,
              };
              array.push(obj);
            });
          });
        }
      });
    } catch (err) {
      console.log('Error getting documents', err);
    } finally {
      return array;
    }
  }

  handleCreateFolder = (key) => {
    this.setState((state) => {
      state.files = state.files.concat([
        {
          key: key,
        },
      ]);
      return state;
    });
  };
  handleCreateFiles = (files, prefix) => {
    this.setState((state) => {
      const newFiles = files.map((file) => {
        let newKey = prefix;
        if (
          prefix !== '' &&
          prefix.substring(prefix.length - 1, prefix.length) !== '/'
        ) {
          newKey += '/';
        }
        newKey += file.name;
        return {
          key: newKey,
          size: file.size,
          modified: +Moment(),
        };
      });

      const uniqueNewFiles = [];
      newFiles.map((newFile) => {
        let exists = false;
        state.files.map((existingFile) => {
          if (existingFile.key === newFile.key) {
            exists = true;
          }
        });
        if (!exists) {
          uniqueNewFiles.push(newFile);
        }
      });
      state.files = state.files.concat(uniqueNewFiles);
      return state;
    });
  };
  handleRenameFolder = (oldKey, newKey) => {
    this.setState((state) => {
      const newFiles = [];
      state.files.map((file) => {
        if (file.key.substr(0, oldKey.length) === oldKey) {
          newFiles.push({
            ...file,
            key: file.key.replace(oldKey, newKey),
            modified: +Moment(),
          });
        } else {
          newFiles.push(file);
        }
      });
      state.files = newFiles;
      return state;
    });
  };

  handleRenameFile = async (oldKey, newKey) => {
    this.setState((state) => {
      const newFiles = [];
      state.files.map((file) => {
        if (file.key === oldKey) {
          console.log(file);
          newFiles.push({
            ...file,
            key: newKey,
            modified: +Moment(),
            fullPathDestiny: file.fullPathOrigin.replace(oldKey, newKey),
          });
          const lastFile = newFiles.slice(-1);
          //await storage.bucket(bucketName).file(lastFile[0].fullPathOrigin).move(lastFile[0].fullPathDestiny);

          //this.moveFile(lastFile[0].fullPathOrigin, lastFile[0].fullPathDestiny).catch(console.error);

          const result = this.moveFirebaseFile(
            file.url,
            lastFile[0].fullPathDestiny
          );
          console.log(result);
        } else {
          newFiles.push(file);
        }
      });
      state.files = newFiles;
      return state;
    });
  };

  async moveFile(srcFilename, destFilename) {
    const { Storage } = require('@google-cloud/storage');
    const bucketName = 'trida-7f28f.appspot.com';
    // Moves the file within the bucket
    const storageBucket = new Storage();
    await storageBucket.bucket(bucketName).file(srcFilename).move(destFilename);

    console.log(
      `gs://${bucketName}/${srcFilename} moved to gs://${bucketName}/${destFilename}.`
    );
  }

  /**
   * Moves a file in firebase storage from its current location to the destination
   * returns the status object for the moved file.
   * @param {String} currentPath The path to the existing file from storage root
   * @param {String} destinationPath The desired pathe for the existing file after storage
   */
  async moveFirebaseFile(currentFileUrl, destinationPath) {
    try {
      storage
        .ref(`${currentFileUrl}`)
        .getDownloadURL()
        .then((url) => {
          fetch(url).then((htmlReturn) => {
            let fileArray = new Uint8Array();
            const reader = htmlReturn.body.getReader();

            //get the reader that reads the readable stream of data
            reader
              .read()
              .then(function appendStreamChunk({ done, value }) {
                //If the reader doesn't return "done = true" append the chunk that was returned to us
                // rinse and repeat until it is done.
                if (value) {
                  fileArray = this.mergeTypedArrays(fileArray, value);
                }
                if (done) {
                  console.log(fileArray);
                  return fileArray;
                } else {
                  // "Readout not complete, reading next chunk"
                  return reader.read().then(appendStreamChunk);
                }
              })
              .then((file) => {
                //Write the file to the new storage place
                let status = storage.ref().child(destinationPath).put(file);
                //Remove the old reference
                currentFileUrl.delete();

                return status;
              });
          });
        });
    } catch (err) {
      console.log(err);
    }
  }

  async mergeTypedArrays(a, b) {
    var c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);

    return c;
  }

  handleDeleteFolder = (folderKeys) => {
    var files = [];
    for (const folder of folderKeys) {
      files = files.concat(
        this.state.files
          .filter(function (obj) {
            return obj.key.startsWith(folder);
          })
          .map(function (obj) {
            return obj.key;
          })
      );

      this.setState((state) => {
        const newFiles = [];
        state.files.map((file) => {
          if (file.key.substr(0, folder.length) !== folder) {
            newFiles.push(file);
          }
        });
        state.files = newFiles;
        return state;
      });
    }
    this.handleDeleteFile(files);
  };

  handleDeleteFile = (filesKey) => {
    if (filesKey.length == 0) return;
    this.setState((state) => ({
      isLoading: true,
    }));
    var cant = filesKey.length;
    for (const f of filesKey) {
      var fileRef = storage.ref(`${this.state.subjectId}/${f}`);
      fileRef
        .delete()
        .then(() => {
          // File deleted successfully
          this.setState((state) => {
            const newFiles = [];
            state.files.map((file) => {
              if (file.key !== f) {
                newFiles.push(file);
              }
            });
            state.files = newFiles;
            return state;
          });
          cant = cant - 1;
          if (cant === 0) this.showDeleteMessage();
        })
        .catch(function (error) {
          // Uh-oh, an error occurred!
          console.log('Error deleting documents', error);
        });
    }
  };

  showDeleteMessage() {
    NotificationManager.success(
      'Los archivos han sido eliminados correctamente',
      '¡Archivos eliminados!',
      3000,
      null,
      null,
      ''
    );
    this.setState((state) => ({
      isLoading: false,
    }));
  }

  handleDownloadFile = (fileKey) => {
    var file = this.state.files.find((i) => i.key == fileKey);
    window.open(file.url, '_blank'); //to open new page
  };

  async submitFiles(rename = false) {
    this.setState((state) => ({
      isLoading: true,
      modalRenameOpen: false,
    }));
    var cant = this.state.dropZone.length;

    for (const file of this.state.dropZone) {
      //Obtenemos la referencia a la materia
      var name = file.fullPath ? file.fullPath : file.name;
      if (rename && this.state.repeatedFiles.includes(name)) {
        var pos = name.lastIndexOf('.');
        name = name.substring(0, pos) + '- Copia.' + name.substring(pos + 1);
      }
      var listRef = storage.ref(`${this.state.subjectId}/${name}`);
      const task = listRef.put(file);
      task.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.error(error.message);
        },
        () => {
          cant = cant - 1;
          //Elimino de dropzone los archivos ya subidos
          var buttonRemove = document.getElementById('buttonRemove');
          if (buttonRemove) buttonRemove.click();
          if (cant === 0) this.updateFilesList();
        }
      );
    }
  }

  validateDuplicatedFiles(event) {
    try {
      var repeatedFiles = [];
      this.setState((state) => ({
        isLoading: true,
      }));
      this.state.dropZone.map((file) => {
        var result = this.state.files.filter(
          (x) => x.key === (file.fullPath ? file.fullPath : file.name)
        );
        if (result.length != 0) repeatedFiles.push(result.shift().key);
      });
      if (repeatedFiles.length != 0) {
        this.setState((state) => ({
          modalRenameOpen: true,
          repeatedFiles: repeatedFiles,
          isLoading: false,
        }));
      } else this.submitFiles(event);
    } catch (error) {
      console.log(error);
    }
  }

  renameFiles = (id) => {
    this.setState((state) => ({
      modalRenameOpen: !state.modalRenameOpen,
      isLoading: true,
    }));
    this.submitFiles(true);
  };

  updateFilesList() {
    NotificationManager.success(
      'Tus archivos han sido cargados correctamente',
      '¡Carga completa!',
      3000,
      null,
      null,
      ''
    );
    this.setState((state) => ({
      dropZone: [],
      renameFiles: [],
      isLoading: true,
      canSubmitFiles: true,
    }));
    this.dataListRenderer();
  }

  callbackFunction = (childData, dropZone) => {
    this.setState((state) => {
      state.canSubmitFiles = childData;
      state.dropZone = dropZone
        ? state.dropZone.concat(dropZone)
        : state.dropZone;
      return state;
    });
  };

  callbackDeleteFunction = (file) => {
    this.setState((state) => ({
      dropZone: state.dropZone.filter(function (value, index, arr) {
        return value.name != file.name;
      }),
      canSubmitFiles: state.dropZone.length != 0,
      repeatedFiles: [],
    }));
  };

  render() {
    const {
      isLoading,
      canSubmitFiles,
      modalRenameOpen,
      repeatedFiles,
    } = this.state;
    return (
      <Fragment>
        {isLoading ? <div id="cover-spin"></div> : <span></span>}
        <div className="disable-text-selection">
          <HeaderDeModulo heading="menu.content" />
        </div>
        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <Dropzone
                  ref={this.dropZoneRef}
                  parentCallback={this.callbackFunction}
                  deleteFile={this.callbackDeleteFunction}
                />
              </CardBody>
            </Card>
          </Colxx>
        </Row>
        <Button
          color="primary"
          disabled={canSubmitFiles}
          className="mb-2"
          onClick={this.validateDuplicatedFiles.bind(this)}
        >
          <IntlMessages id="contenido.agregar" />
        </Button>
        <div className="demo-mount-nested-editable">
          <FileBrowser
            files={this.state.files}
            icons={Icons.FontAwesome(4)}
            detailRenderer={() => null}
            onCreateFolder={this.handleCreateFolder}
            onCreateFiles={this.handleCreateFiles}
            onDeleteFolder={this.handleDeleteFolder}
            onMoveFolder={this.handleRenameFolder}
            onMoveFile={this.handleRenameFile}
            onRenameFolder={this.handleRenameFolder}
            onRenameFile={this.handleRenameFile}
            onDeleteFile={this.handleDeleteFile}
            onDownloadFile={this.handleDownloadFile}
          />
        </div>

        {modalRenameOpen && (
          <ModalConfirmacion
            texto={
              'Los siguientes archivos ya se encuentran cargados: ' +
              repeatedFiles.map((txt) => txt + ' ') +
              '¿Desea reemplazarlos?'
            }
            titulo="Archivos existentes"
            buttonPrimary="Aceptar"
            buttonSecondary="Conservar todos"
            toggle={this.renameFiles}
            isOpen={modalRenameOpen}
            onConfirm={this.submitFiles.bind(this)}
          />
        )}
      </Fragment>
    );
  }
}
const mount = document.querySelectorAll('div.demo-mount-nested-editable');
export default injectIntl(Contenidos, mount[0]);
