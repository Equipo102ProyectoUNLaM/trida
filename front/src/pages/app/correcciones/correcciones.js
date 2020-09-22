import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row } from 'reactstrap';
import { storage } from 'helpers/Firebase';
import '../../../../node_modules/react-keyed-file-browser/dist/react-keyed-file-browser.css';
import ROLES from 'constants/roles';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import DataListView from 'containers/pages/DataListView';
import { getDocument, getCollection } from 'helpers/Firebase-db';
import { isEmpty } from 'helpers/Utils';

function collect(props) {
  return { data: props.data };
}

class Correcciones extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      selectedItems: [],
      files: [],
      isLoading: true,
      subjectId: this.props.subject.id,
      correccionImagen: false,
      correccionTexto: false,
      materiaId: this.props.subject.id,
      idACorregir: '',
      archivoACorregir: '',
      idStorage: '',
      rolDocente: this.props.rol === ROLES.Docente,
      correccionAlumnoUrl: '',
      verCorreccion: false,
      arrayItemsFiltrado: [],
    };
  }

  async componentDidMount() {
    await this.getCorrecciones(this.state.materiaId);
  }

  getCorrecciones = async (materiaId) => {
    const arrayDeObjetos = await getCollection('correcciones', [
      { field: 'idMateria', operator: '==', id: materiaId },
    ]);
    this.dataListRenderer(arrayDeObjetos);
  };

  async dataListRenderer(arrayDeObjetos) {
    for (const correccion of arrayDeObjetos) {
      if (
        correccion.data.idArchivo !== undefined &&
        correccion.data.idArchivo !== ''
      ) {
        correccion.data.url = await this.getFileURL(correccion.data.idArchivo);
      }
    }

    for (let obj of arrayDeObjetos) {
      const alumno = await this.getAlumno(obj.data.idUsuario);
      obj.data.alumno = alumno;
    }

    this.setState({
      items: arrayDeObjetos,
      arrayOriginal: arrayDeObjetos,
      selectedItems: [],
      isLoading: false,
      correccionId: '',
    });
  }

  getFileURL = async (archivo) => {
    const url = await storage
      .ref('materias/' + this.state.materiaId + '/correcciones/')
      .child(archivo)
      .getDownloadURL();
    return url;
  };

  getAlumno = async (id) => {
    const docAlumno = await getDocument(`usuarios/${id}`);
    return docAlumno.data.nombre + ' ' + docAlumno.data.apellido;
  };

  onCorrection = (id, idArchivo, file) => {
    const idStorage = idArchivo.split('.')[0];
    const extension = idArchivo.split('.')[1];
    this.setState({
      archivoACorregir: file,
      idStorage,
      idACorregir: id,
    });
    return this.props.history.push({
      pathname: '/app/correcciones/correccion',
      subjectId: this.props.subject.id,
      url: file,
      idStorage,
      extension,
      id,
      verCorreccion: false,
    });
  };

  onVerCorrection = async (idArchivo, estado, nota, comentario) => {
    const idStorage = idArchivo.split('.')[0];
    const extension = idArchivo.split('.')[1];
    const correccionAlumnoUrl = await this.getFileURL(
      idStorage + '-correccion'
    );
    if (correccionAlumnoUrl) {
      this.setState({ correccionAlumnoUrl, verCorreccion: true });
      this.props.history.push({
        pathname: '/app/correcciones/correccion',
        subjectId: this.props.subject.id,
        url: correccionAlumnoUrl,
        idStorage,
        verCorreccion: true,
        estadoCorreccionVer: estado,
        notaCorreccionVer: nota,
        comentarioVer: comentario,
        extension,
      });
      this.setState({ verCorreccion: false });
    }
  };

  onSearchKey = (search) => {
    const { target } = search;
    const { value } = target;
    const busqueda = value.toLowerCase();

    const itemsArray = [...this.state.arrayOriginal];
    const arrayFiltrado = itemsArray.filter((elem) => {
      return (
        elem.data.alumno.toLowerCase().includes(busqueda) ||
        elem.data.nombre.toLowerCase().includes(busqueda) ||
        elem.data.tipo.toLowerCase().includes(busqueda) ||
        elem.data.estado.toLowerCase() === busqueda
      );
    });
    this.setState({
      items: arrayFiltrado,
    });
  };

  render() {
    const { isLoading, items, rolDocente } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.my-corrections"
            toggleModal={null}
            buttonText={null}
          />
          <Row>
            <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
              <input
                type="text"
                name="keyword"
                id="search"
                placeholder="Búsqueda por alumno, estado, nombre de actividad, tipo de actividad..."
                onChange={(e) => this.onSearchKey(e)}
              />
            </div>
            {!isEmpty(items) &&
              items.map((correccion) => {
                return (
                  <DataListView
                    key={correccion.id + 'dataList'}
                    id={correccion.id}
                    idArchivo={correccion.data.idArchivo}
                    dataCorreccion={correccion.data}
                    title={correccion.data.nombre}
                    text1={
                      correccion.data.mensaje !== undefined
                        ? 'Mensaje: ' + correccion.data.mensaje
                        : null
                    }
                    text2={
                      rolDocente ? 'Alumno: ' + correccion.data.alumno : ' '
                    }
                    estado={correccion.data.estado}
                    file={correccion.data.url}
                    onCorrection={rolDocente ? this.onCorrection : null}
                    onVerCorrection={this.onVerCorrection}
                    isSelect={this.state.selectedItems.includes(correccion.id)}
                    navTo="#"
                    collect={collect}
                  />
                );
              })}{' '}
          </Row>
          {isEmpty(items) && (
            <Row className="ml-0">
              <span>No hay resultados</span>
            </Row>
          )}
        </div>
        {/* {correccionImagen && (
          <Modal
            isOpen={correccionImagen}
            size="xl"
            toggle={this.toggleCorreccionImagen}
            className="modal-correccion"
          >
            <ModalHeader toggle={this.toggleCorreccionImagen}>
              <span>{rolDocente ? 'Corregir' : 'Ver corrección'}</span>
            </ModalHeader>
            <ModalBody className="modal-correccion">
              <CorreccionImagen
                idACorregir={idACorregir}
                archivoACorregir={archivoACorregir}
                idStorage={idStorage}
                correccionAlumnoUrl={correccionAlumnoUrl}
                toggle={this.toggleCorreccionImagen}
                verCorreccionDocente={verCorreccionDocente}
              />
            </ModalBody>
          </Modal>
        )} */}
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

export default withRouter(connect(mapStateToProps)(Correcciones));
