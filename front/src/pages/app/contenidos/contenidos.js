import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Card, CardBody, Button } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import FileBrowser, { Icons } from 'react-keyed-file-browser';
import { storage } from 'helpers/Firebase';
import Moment from 'moment';
import '../../../../node_modules/react-keyed-file-browser/dist/react-keyed-file-browser.css';
import Dropzone from 'containers/forms/Dropzone';
import { Colxx } from 'components/common/CustomBootstrap';
import { NotificationManager } from 'components/common/react-notifications';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import { DefaultAction } from 'constants/fileBrowser/actions';
import { DefaultFilter } from 'constants/fileBrowser/filters';
import {
  DefaultConfirmDeletion,
  MultipleConfirmDeletion,
} from 'constants/fileBrowser/confirmations';
import ModalVideo from './modal-video';
import ModalAudio from './modal-audio';
import ROLES from 'constants/roles';
import {
  enviarNotificacionExitosa,
  enviarNotificacionError,
} from 'helpers/Utils-ui';

class Contenidos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      isLoading: true,
      canSubmitFiles: true, //boton inhabilitado
      dropZone: [],
      subjectId: this.props.subject.id,
      modalRenameOpen: false,
      selectedFolder: '',
      repeatedFiles: [],
      modalVideoOpen: false,
      modalAudioOpen: false,
    };
    this.listFolderItems = this.listFolderItems.bind(this);
    this.submitFiles = this.submitFiles.bind(this);
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
    let arrayFolder = [];
    let arrayFiles = [];
    try {
      //Obtenemos la referencia de la carpeta que quiero listar (La de la materia)
      const listRef = storage.ref(
        'materias/' + this.state.subjectId + '/contenidos'
      );
      // Obtenemos las referencias de carpetas y archivos
      await listRef.listAll().then(async (result) => {
        //Carpetas
        let ctrFolder = 0;
        result.prefixes.forEach(async (folderRef) => {
          ctrFolder++;
          let subFolderElements = await this.listFolderItems(
            folderRef,
            this.state.subjectId
          );
          arrayFolder = arrayFolder.concat(
            [
              {
                key:
                  folderRef.fullPath.replace(
                    'materias/' + this.state.subjectId + '/contenidos/',
                    ''
                  ) + '/',
              },
            ],
            subFolderElements
          );
          if (ctrFolder === result.prefixes.length) {
            this.setState((state) => ({
              files: state.files.concat(arrayFolder),
            }));
            arrayFolder = [];
          }
        });

        //Archivos
        let ctrFiles = 0;
        result.items.forEach(async (res) => {
          ctrFiles++;
          await res.getMetadata().then(async (metadata) => {
            await res.getDownloadURL().then(async (url) => {
              let obj = {
                key: metadata.fullPath.replace(
                  'materias/' + this.state.subjectId + '/contenidos/',
                  ''
                ),
                modified: Moment(metadata.updated),
                size: metadata.size,
                url: url,
              };

              arrayFiles.push(obj);

              if (ctrFiles === result.items.length) {
                this.setState((state) => ({
                  files: state.files.concat(arrayFiles),
                }));
                arrayFiles = [];
              }
            });
          });
        });
      });
    } catch (err) {
      enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
    } finally {
      this.setState((state) => ({
        isLoading: false,
      }));
    }
  }

  async listFolderItems(ref, subjectId) {
    let arrayFolder = [];
    let arrayFiles = [];
    try {
      await ref.listAll().then(async (result) => {
        //Carpetas
        let ctrFolder = 0;
        result.prefixes.forEach(async (folderRef) => {
          ctrFolder++;
          let subFolderElements = await this.listFolderItems(
            folderRef,
            subjectId
          );
          arrayFolder = arrayFolder.concat(
            [
              {
                key:
                  folderRef.fullPath.replace(
                    'materias/' + this.state.subjectId + '/contenidos/',
                    ''
                  ) + '/',
              },
            ],
            subFolderElements
          );

          if (ctrFolder === result.prefixes.length) {
            this.setState((state) => ({
              files: state.files.concat(arrayFolder),
            }));
            arrayFolder = [];
          }
        });

        //Archivos
        let ctrFiles = 0;
        result.items.forEach(async (res) => {
          ctrFiles++;
          await res.getMetadata().then(async (metadata) => {
            await res.getDownloadURL().then(async (url) => {
              let obj = {
                key: metadata.fullPath.replace(
                  'materias/' + subjectId + '/contenidos/',
                  ''
                ),
                modified: Moment(metadata.updated),
                size: metadata.size,
                url: url,
              };
              arrayFiles.push(obj);
              if (ctrFiles === result.items.length) {
                this.setState((state) => ({
                  files: state.files.concat(arrayFiles),
                }));
                arrayFiles = [];
              }
            });
          });
        });
      });
    } catch (err) {
      enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
    } finally {
      return arrayFolder.concat(arrayFiles);
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
    let files = [];
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
        state.files.forEach((file) => {
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
    if (filesKey.length === 0) return;
    this.setState((state) => ({
      isLoading: true,
    }));
    let cant = filesKey.length;
    for (const f of filesKey) {
      if (f.slice(-1) !== '/') {
        //Si es carpeta no hago nada
        const fileRef = storage.ref(
          `materias/${this.state.subjectId}/contenidos/${f}`
        );
        fileRef
          .delete()
          .then(() => {
            // File deleted successfully
            this.setState((state) => {
              const newFiles = [];

              state.files.forEach((file) => {
                if (file.key !== f) {
                  newFiles.push(file);
                }
              });
              state.files = newFiles;
              return state;
            });
          })
          .catch(function (error) {
            enviarNotificacionError(
              'Hubo un error. Reintentá mas tarde',
              'Ups!'
            );
          });
      }
      cant = cant - 1;
      if (cant === 0) this.showDeleteMessage();
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
    if (!folderKey) return;
    this.setState((state) => ({
      selectedFolder: folderKey.key,
    }));
  };

  handleDownloadFile = (fileKeys) => {
    fileKeys.forEach((fileKey) => {
      const file = this.state.files.find((i) => i.key === fileKey);
      window.open(file.url, '_blank'); //to open new page
    });
  };

  async submitFiles(rename = false) {
    this.setState((state) => ({
      isLoading: true,
      modalRenameOpen: false,
    }));
    let cant = this.state.dropZone.length;

    this.state.dropZone.forEach((file) => {
      //Obtenemos la referencia a la materia
      let name = file.fullPath ? file.fullPath : file.name;
      if (
        rename &&
        this.state.repeatedFiles.includes(this.state.selectedFolder + name)
      ) {
        const pos = name.lastIndexOf('.');
        name = name.substring(0, pos) + '- Copia.' + name.substring(pos + 1);
      }

      //Si seleccionó una carpeta, lo guardo en esa carpeta
      const listRef = storage.ref(
        `materias/${this.state.subjectId}/contenidos/${this.state.selectedFolder}${name}`
      );

      const task = listRef.put(file);
      task.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
        },
        () => {
          cant--;
          //Elimino de dropzone los archivos ya subidos
          let buttonRemove = document.getElementById('buttonRemove');
          if (buttonRemove) buttonRemove.click();
          if (cant === 0) {
            this.updateFilesList();
            enviarNotificacionExitosa(
              'Tus archivos han sido cargados correctamente',
              '¡Carga completa!'
            );
          }
        }
      );
    });
  }

  validateDuplicatedFiles(event) {
    try {
      //Verifico si hay alguna carpeta seleccionada
      let noFolder = !document.getElementsByClassName('folder selected').length;

      this.setState(
        (prevState) => ({
          selectedFolder: noFolder ? '' : prevState.selectedFolder,
          isLoading: true,
        }),
        () => {
          let repeatedFiles = [];
          //Busco repetidos en la carpeta seleccionada (En el caso de haberlo hecho, sino en el raiz)
          this.state.dropZone.forEach((file) => {
            let result = this.state.files.filter(
              (x) =>
                x.key ===
                (this.state.selectedFolder
                  ? this.state.selectedFolder + file.name
                  : file.name)
            );
            if (result.length !== 0) repeatedFiles.push(result.shift().key);
          });

          if (repeatedFiles.length !== 0) {
            this.setState((state) => ({
              modalRenameOpen: true,
              repeatedFiles: repeatedFiles,
              isLoading: false,
            }));
          } else this.submitFiles();
        }
      );
    } catch (error) {
      enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
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
    this.setState((state) => ({
      dropZone: [],
      files: [],
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
        return value.name !== file.name;
      }),
      canSubmitFiles: state.dropZone.length !== 0,
      repeatedFiles: [],
    }));
  };

  toggleModalAudio = () => {
    this.setState({
      modalAudioOpen: !this.state.modalAudioOpen,
    });
    if (!this.state.modalAudioOpen) {
      this.updateFilesList();
    }
  };

  toggleModalVideo = () => {
    this.setState({
      modalVideoOpen: !this.state.modalVideoOpen,
    });
    if (!this.state.modalVideoOpen) {
      this.updateFilesList();
    }
  };

  render() {
    const {
      isLoading,
      canSubmitFiles,
      modalRenameOpen,
      repeatedFiles,
      modalVideoOpen,
      modalAudioOpen,
      subjectId,
    } = this.state;
    const { rol } = this.props;
    const rolDocente = rol !== ROLES.Alumno;
    return (
      <Fragment>
        {isLoading ? <div id="cover-spin"></div> : <span></span>}
        <div className="disable-text-selection">
          <HeaderDeModulo heading="menu.content" />
        </div>
        {rolDocente && (
          <>
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
            <Button
              color="primary"
              className="mb-2 ml-1"
              onClick={this.toggleModalVideo}
            >
              <IntlMessages id="contenido.grabar-video" />
            </Button>
            <Button
              color="primary"
              className="mb-2 ml-1"
              onClick={this.toggleModalAudio}
            >
              <IntlMessages id="contenido.grabar-audio" />
            </Button>
            {modalVideoOpen && (
              <ModalVideo
                toggleModal={this.toggleModalVideo}
                modalOpen={modalVideoOpen}
                modalHeader="contenido.grabar-video"
                subjectId={subjectId}
              />
            )}
            {modalAudioOpen && (
              <ModalAudio
                toggleModal={this.toggleModalAudio}
                modalOpen={modalAudioOpen}
                modalHeader="contenido.grabar-audio"
                subjectId={subjectId}
              />
            )}
          </>
        )}
        <div className="demo-mount-nested-editable">
          <FileBrowser
            files={this.state.files}
            icons={Icons.FontAwesome(4)}
            detailRenderer={() => null}
            onSelectFolder={this.handleSelectFolder}
            onCreateFolder={rolDocente ? this.handleCreateFolder : false}
            onDeleteFolder={rolDocente ? this.handleDeleteFolder : false}
            onDeleteFile={rolDocente ? this.handleDeleteFile : false}
            onDownloadFile={this.handleDownloadFile}
            actionRenderer={DefaultAction}
            filterRenderer={DefaultFilter}
            confirmDeletionRenderer={DefaultConfirmDeletion}
            confirmMultipleDeletionRenderer={MultipleConfirmDeletion}
            noFilesMessage="Sin archivos."
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
            onConfirm={() => {
              this.submitFiles();
            }}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ seleccionCurso, authUser }) => {
  const { subject } = seleccionCurso;
  const { userData } = authUser;
  const { rol } = userData;
  return { subject, rol };
};

const mount = document.querySelectorAll('div.demo-mount-nested-editable');
export default connect(mapStateToProps)(injectIntl(Contenidos, mount[0]));
