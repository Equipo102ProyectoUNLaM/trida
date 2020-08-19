import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import FileBrowser, { Icons } from 'react-keyed-file-browser';
import { storage } from 'helpers/Firebase';
import Moment from 'moment';
import '../../../../node_modules/react-keyed-file-browser/dist/react-keyed-file-browser.css';
import { DefaultDetail } from 'constants/fileBrowser/details';
import { DefaultActionCorrecciones } from 'constants/fileBrowser/actions';
import { DefaultFilter } from 'constants/fileBrowser/filters';

class Correcciones extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      isLoading: true,
      subjectId: this.props.subject.id,
    };
  }

  async componentDidMount() {
    await this.getCorrecciones();
  }

  async getCorrecciones() {
    let arrayFiles = [];

    try {
      //Obtenemos la referencia de la carpeta que quiero listar (La de la materia)
      const listRef = storage.ref(this.state.subjectId + '/correcciones');
      await listRef.listAll().then(async (result) => {
        //Archivos
        let ctrFiles = 0;
        result.items.forEach(async (res) => {
          ctrFiles++;
          await res.getMetadata().then(async (metadata) => {
            await res.getDownloadURL().then(async (url) => {
              const fileKey = this.getPlainName(metadata.fullPath);
              let obj = {
                fullKey: metadata.fullPath.replace(
                  this.state.subjectId + '/correcciones/',
                  ''
                ),
                key: fileKey,
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
    } catch (error) {
      console.log('Error getting documents of Correciones', error);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }

  /*Esta funcion la uso para eliminar el id_usuario de la key de la correccion
    ya que tiene la forma "idUsuario-nombreCorreccion", ya que la Key es el campo
    que se muestra en la lista de correcciones */

  getPlainName(text) {
    //Elimino la parte de "materiaID/correcciones/" del path
    let newText = text.replace(this.state.subjectId + '/correcciones/', '');
    const pos = newText.indexOf('-'); //Busco el primer "-", que representa el idUsuario para eliminarlo
    if (pos) {
      return newText.slice(pos + 1);
    } else {
      return newText;
    }
  }

  handleDownloadFile = (fileKeys) => {
    fileKeys.forEach((fileKey) => {
      const file = this.state.files.find((i) => i.key === fileKey);
      window.open(file.url, '_blank'); //to open new page
    });
  };

  render() {
    const { isLoading, files } = this.state;
    return (
      <Fragment>
        {isLoading ? <div id="cover-spin"></div> : <span></span>}

        <Row>
          <Colxx xxs="8">
            <h1>
              <IntlMessages id="menu.my-corrections" />
            </h1>
            <Separator className="mb-5" />
          </Colxx>
        </Row>

        <div className="demo-mount-nested-editable">
          <FileBrowser
            files={files}
            icons={Icons.FontAwesome(4)}
            detailRenderer={DefaultDetail}
            actionRenderer={DefaultActionCorrecciones}
            onDownloadFile={this.handleDownloadFile}
            filterRenderer={DefaultFilter}
          />
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = ({ seleccionCurso }) => {
  const { subject } = seleccionCurso;
  return {
    subject,
  };
};

const mount = document.querySelectorAll('div.demo-mount-nested-editable');
export default connect(mapStateToProps)(Correcciones, mount[0]);
