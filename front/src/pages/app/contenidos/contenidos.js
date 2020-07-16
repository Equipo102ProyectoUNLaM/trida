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
      var subject = JSON.parse(localStorage.getItem('subject'));
      //Obtenemos la referencia de la carpeta que quiero listar (La de la materia)
      var listRef = storage.ref(subject.id);
      // Obtenemos las referencias de carpetas y archivos
      await listRef.listAll().then(async (result) => {
        //Carpetas
        for (const folderRef of result.prefixes) {
          //Listamos archivos de cada carpeta
          var subFolderElements = await this.listFolderItems(
            folderRef,
            subject.id
          );
          array = array.concat(subFolderElements);
        }
        //Archivos
        for (const res of result.items) {
          await res.getMetadata().then(async (metadata) => {
            await res.getDownloadURL().then(async (url) => {
              var obj = {
                key: metadata.fullPath.replace(subject.id + '/', ''),
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
  handleRenameFile = (oldKey, newKey) => {
    this.setState((state) => {
      const newFiles = [];
      state.files.map((file) => {
        if (file.key === oldKey) {
          newFiles.push({
            ...file,
            key: newKey,
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
    console.log(files);
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
            console.log(state.files);
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

  handleOnChange(event) {
    this.setState((state) => ({
      isLoading: true,
    }));
    var subject = JSON.parse(localStorage.getItem('subject'));
    var cant = this.state.dropZone.length;
    for (const file of this.state.dropZone) {
      //Obtenemos la referencia a la materia
      console.log(file);
      var listRef = storage.ref(
        `${subject.id}/${file.fullPath ? file.fullPath : file.name}`
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
      isLoading: true,
      canSubmitFiles: true,
    }));
    this.dataListRenderer();
  }

  callbackFunction = (childData, dropZone) => {
    this.setState((state) => ({
      canSubmitFiles: childData,
      dropZone: dropZone ? state.dropZone.concat(dropZone) : state.dropZone,
    }));
  };

  callbackDeleteFunction = (file) => {
    this.setState((state) => ({
      dropZone: state.dropZone.filter(function (value, index, arr) {
        return value.name != file.name;
      }),
      canSubmitFiles: state.dropZone.length != 0,
    }));
  };

  render() {
    const { isLoading, canSubmitFiles } = this.state;
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
          onClick={this.handleOnChange.bind(this)}
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
      </Fragment>
    );
  }
}
const mount = document.querySelectorAll('div.demo-mount-nested-editable');
export default injectIntl(Contenidos, mount[0]);
