import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import contents from 'data/contents';
import Contents from 'containers/dashboards/contents';
import FileBrowser, {
  FileRenderers,
  FolderRenderers,
  Groupers,
  Icons,
} from 'react-keyed-file-browser';
import { storage } from 'helpers/Firebase';
import Moment from 'moment';
import '../../../../node_modules/react-keyed-file-browser/dist/react-keyed-file-browser.css';

function collect(props) {
  return { data: props.data };
}

class Contenidos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      isLoading: true,
    };
    this.listFolderItems = this.listFolderItems.bind(this);
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
      // Create a reference under which you want to list
      var listRef = storage.ref(subject.id);

      // Now we get the references of these images

      await listRef.listAll().then(async (result) => {
        for (const folderRef of result.prefixes) {
          var subFolderElements = await this.listFolderItems(
            folderRef,
            subject.id
          );
          array = array.concat(subFolderElements);
        }

        for (const res of result.items) {
          // And finally display them
          await res.getMetadata().then(async (metadata) => {
            await res.getDownloadURL().then(async (url) => {
              var obj = {
                key: metadata.fullPath.replace(subject.id + '/', ''),
                modified: metadata.updated,
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
        for (const folderRef of result.prefixes) {
          var subFolderElements = await this.listFolderItems(
            folderRef,
            subjectId
          );
          array = array.concat(subFolderElements);
        }

        for (const res of result.items) {
          // And finally display them
          await res.getMetadata().then(async (metadata) => {
            await res.getDownloadURL().then(async (url) => {
              var obj = {
                key: metadata.fullPath.replace(subjectId + '/', ''),
                modified: metadata.updated,
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
  handleDeleteFolder = (folderKey) => {
    this.setState((state) => {
      const newFiles = [];
      state.files.map((file) => {
        if (file.key.substr(0, folderKey.length) !== folderKey) {
          newFiles.push(file);
        }
      });
      state.files = newFiles;
      return state;
    });
  };
  handleDeleteFile = (fileKey) => {
    this.setState((state) => {
      const newFiles = [];
      state.files.map((file) => {
        if (file.key !== fileKey) {
          newFiles.push(file);
        }
      });
      state.files = newFiles;
      return state;
    });
  };

  handleDownloadFile = (fileKey) => {
    var file = this.state.files.find((i) => i.key == fileKey);
    window.open(file.url, '_blank'); //to open new page
  };

  render() {
    const { isLoading } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.content"
            toggleModal={this.toggleModal}
            buttonText="contenido.agregar"
          />
        </div>
        <div className="demo-mount-nested-editable">
          <FileBrowser
            files={this.state.files}
            icons={Icons.FontAwesome(4)}
            detailRenderer={() => null}
            onCreateFolder={this.handleCreateFolder}
            onCreateFiles={this.handleCreateFiles}
            onMoveFolder={this.handleRenameFolder}
            onMoveFile={this.handleRenameFile}
            onRenameFolder={this.handleRenameFolder}
            onRenameFile={this.handleRenameFile}
            onDeleteFolder={this.handleDeleteFolder}
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
