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
      selectedFolder: '',
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
      var listRef = storage.ref(this.state.subjectId + '/contenidos');
      // Obtenemos las referencias de carpetas y archivos
      await listRef.listAll().then(async (result) => {
        //Carpetas
        for (const folderRef of result.prefixes) {
          var subFolderElements = await this.listFolderItems(
            folderRef,
            this.state.subjectId
          );
          array = array.concat(
            [
              {
                key:
                  folderRef.fullPath.replace(
                    this.state.subjectId + '/contenidos/',
                    ''
                  ) + '/',
              },
            ],
            subFolderElements
          );
        }
        //Archivos
        for (const res of result.items) {
          await res.getMetadata().then(async (metadata) => {
            await res.getDownloadURL().then(async (url) => {
              var obj = {
                key: metadata.fullPath.replace(
                  this.state.subjectId + '/contenidos/',
                  ''
                ),
                modified: Moment(metadata.updated),
                size: metadata.size,
                url: url,
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
          array = array.concat(
            [
              {
                key:
                  folderRef.fullPath.replace(
                    this.state.subjectId + '/contenidos/',
                    ''
                  ) + '/',
              },
            ],
            subFolderElements
          );
        }
        //Archivos
        for (const res of result.items) {
          await res.getMetadata().then(async (metadata) => {
            await res.getDownloadURL().then(async (url) => {
              var obj = {
                key: metadata.fullPath.replace(subjectId + '/contenidos/', ''),
                modified: Moment(metadata.updated),
                size: metadata.size,
                url: url,
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
    this.setState((state) => {
      state.selectedFolder = key;
    });
  };

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
      var fileRef = storage.ref(`${this.state.subjectId}/contenidos/${f}`);
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

  handleSelectFolder = (folderKey) => {
    //Al crear una nueva carpeta, la marco como seleccionada
    this.setState((state) => {
      state.selectedFolder = folderKey.key;
    });
  };

  handleDownloadFile = (fileKeys) => {
    fileKeys.forEach((fileKey) => {
      var file = this.state.files.find((i) => i.key == fileKey);
      window.open(file.url, '_blank'); //to open new page
    });
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
      if (
        rename &&
        this.state.repeatedFiles.includes(this.state.selectedFolder + name)
      ) {
        var pos = name.lastIndexOf('.');
        name = name.substring(0, pos) + '- Copia.' + name.substring(pos + 1);
      }

      //Si seleccionó una carpeta, lo guardo en esa carpeta
      var listRef = storage.ref(
        `${this.state.subjectId}/contenidos/${this.state.selectedFolder}${name}`
      );

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
      //Verifico si hay alguna carpeta seleccionada
      var noFolder = !document.getElementsByClassName('folder selected').length;

      this.setState(
        (prevState) => ({
          selectedFolder: noFolder ? '' : prevState.selectedFolder,
          isLoading: true,
        }),
        () => {
          var repeatedFiles = [];
          //Busco repetidos en la carpeta seleccionada (En el caso de haberlo hecho, sino en el raiz)
          this.state.dropZone.map((file) => {
            var result = this.state.files.filter(
              (x) =>
                x.key ===
                (this.state.selectedFolder
                  ? this.state.selectedFolder + file.name
                  : file.name)
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
        }
      );
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
            onSelectFolder={this.handleSelectFolder}
            onCreateFolder={this.handleCreateFolder}
            onDeleteFolder={this.handleDeleteFolder}
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
