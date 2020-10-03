import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Button, ButtonGroup } from 'reactstrap';
import { storage } from 'helpers/Firebase';
import '../../../../node_modules/react-keyed-file-browser/dist/react-keyed-file-browser.css';
import ROLES from 'constants/roles';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { Colxx } from 'components/common/CustomBootstrap';
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
      cSelected: [],
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
    this.setState({
      archivoACorregir: file,
      idStorage,
      idACorregir: id,
    });
    return this.props.history.push(`/app/correcciones/correccion/${id}`);
  };

  onVerCorrection = async (id, idArchivo) => {
    const idStorage = idArchivo.split('.')[0];
    if (idStorage) {
      this.props.history.push(`/app/correcciones/correccion/${id}#ver`);
    }
  };

  handleChangeMulti = (selectedOptions) => {
    this.setState({ selectedOptions });
  };

  normalizarString = (nombre) => {
    let nombreNormal = nombre.replace(/á/g, 'a');
    nombreNormal = nombreNormal.replace(/é/g, 'e');
    nombreNormal = nombreNormal.replace(/í/g, 'i');
    nombreNormal = nombreNormal.replace(/ó/g, 'o');
    nombreNormal = nombreNormal.replace(/ú/g, 'u');
    return nombreNormal.toLowerCase();
  };

  normalizarBusqueda = (search) => {
    const { target } = search;
    const { value } = target;
    let busqueda = value.toLowerCase();
    busqueda = busqueda.replace(/\//g, '');
    busqueda = busqueda.replace(/-/g, '');
    busqueda = this.normalizarString(busqueda);
    return busqueda;
  };

  onSearchKey = (search) => {
    const busqueda = this.normalizarBusqueda(search);
    const itemsArray = [...this.state.arrayOriginal];

    const arrayFiltrado = itemsArray.filter((elem) => {
      const alumno = this.normalizarString(elem.data.alumno);
      const nombre = this.normalizarString(elem.data.nombre);
      const tipo = this.normalizarString(elem.data.tipo);
      const estado = this.normalizarString(elem.data.estado);
      return (
        alumno.includes(busqueda) ||
        nombre.includes(busqueda) ||
        tipo.includes(busqueda) ||
        estado === busqueda
      );
    });
    this.setState({
      items: arrayFiltrado,
    });
  };

  onCheckboxBtnClick = (selected) => {
    const index = this.state.cSelected.indexOf(selected);
    if (index < 0) {
      this.state.cSelected.push(selected);
    } else {
      this.state.cSelected.splice(index, 1);
    }
    this.setState({ cSelected: [...this.state.cSelected] }, () => {
      if (this.state.cSelected.length === 1 && this.state.cSelected[0] === 1) {
        return this.onSearchKey({ target: { value: 'Corregido' } });
      }
      if (this.state.cSelected.length === 1 && this.state.cSelected[0] === 2) {
        return this.onSearchKey({ target: { value: 'No Corregido' } });
      }
      return this.onSearchKey({ target: { value: '' } });
    });
  };

  render() {
    const { isLoading, items, rolDocente, cSelected } = this.state;
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
            <Colxx xxs="8" md="8">
              <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                <input
                  type="text"
                  name="keyword"
                  id="search"
                  placeholder={
                    rolDocente
                      ? 'Búsqueda por alumno, estado, nombre de actividad, tipo de actividad...'
                      : 'Búsqueda por estado, nombre de actividad, tipo de actividad...'
                  }
                  onChange={(e) => this.onSearchKey(e)}
                  autoComplete="off"
                />
              </div>
            </Colxx>
            <Colxx xxs="4" md="4" className="columna-filtro-badge">
              <ButtonGroup className="filtros-button-group">
                <Button
                  color="secondary"
                  className="filtros-button"
                  onClick={() => this.onCheckboxBtnClick(1)}
                  active={cSelected.includes(1)}
                >
                  Corregido
                </Button>
                <Button
                  color="secondary"
                  className="filtros-button"
                  onClick={() => this.onCheckboxBtnClick(2)}
                  active={cSelected.includes(2)}
                >
                  No Corregido
                </Button>
              </ButtonGroup>
            </Colxx>
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
              <span>No hay correcciones</span>
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
