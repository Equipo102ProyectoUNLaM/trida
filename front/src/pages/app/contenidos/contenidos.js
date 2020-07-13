import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import contents from 'data/contents';
import Contents from 'containers/dashboards/contents';
import FileBrowser, { Icons } from 'react-keyed-file-browser';
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
      files: [
        {
          key: 'photos/animals/cat in a hat.png',
          modified: +Moment().subtract(1, 'hours'),
          size: 1.5 * 1024 * 1024,
        },
        {
          key: 'photos/animals/kitten_ball.png',
          modified: +Moment().subtract(3, 'days'),
          size: 545 * 1024,
        },
        {
          key: 'photos/animals/elephants.png',
          modified: +Moment().subtract(3, 'days'),
          size: 52 * 1024,
        },
        {
          key: 'photos/funny fall.gif',
          modified: +Moment().subtract(2, 'months'),
          size: 13.2 * 1024 * 1024,
        },
        {
          key: 'photos/holiday.jpg',
          modified: +Moment().subtract(25, 'days'),
          size: 85 * 1024,
        },
        {
          key: 'documents/letter chunks.doc',
          modified: +Moment().subtract(15, 'days'),
          size: 480 * 1024,
        },
        {
          key: 'documents/export.pdf',
          modified: +Moment().subtract(15, 'days'),
          size: 4.2 * 1024 * 1024,
        },
      ],
      selectedItems: [],
      isLoading: true,
    };
  }

  // Esto va a hacer el get del storage para la materia
  getContenidos = async () => {
    this.dataListRenderer();
  };

  componentDidMount() {
    this.getContenidos();
  }

  // El toggle va a ser directamente abrir el cuadro de dialogo para subir un archivo, no la modal
  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  onContenidoAgregado = () => {
    this.toggleModal();
    this.getContenidos();
  };

  dataListRenderer() {
    var array = [];
    var subject = localStorage.getItem('subject');
    // Create a reference under which you want to list
    var listRef = storage.ref(subject.id);

    // Find all the prefixes and items.
    listRef
      .listAll()
      .then(function (res) {
        res.prefixes.forEach(function (folderRef) {
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
        });
        res.items.forEach(function (itemRef) {
          // All the items under listRef.
        });
      })
      .catch(function (error) {
        // Uh-oh, an error occurred!
      });
    this.setState({
      items: array,
      selectedItems: [],
      isLoading: false,
    });
  }

  render() {
    const { modalOpen, items, isLoading } = this.state;
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
          <Row>
            <FileBrowser
              files={this.state.files}
              icons={Icons.FontAwesome(4)}
              onCreateFolder={this.handleCreateFolder}
              onCreateFiles={this.handleCreateFiles}
              onMoveFolder={this.handleRenameFolder}
              onMoveFile={this.handleRenameFile}
              onRenameFolder={this.handleRenameFolder}
              onRenameFile={this.handleRenameFile}
              onDeleteFolder={this.handleDeleteFolder}
              onDeleteFile={this.handleDeleteFile}
            />
          </Row>
        </div>
      </Fragment>
    );
  }
}
const mount = document.querySelectorAll('div.demo-mount-nested-editable');
export default injectIntl(Contenidos, mount[0]);
