import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Button, Badge } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import CardTabs from 'components/card-tabs';
import Calendario from 'components/common/Calendario';
import { Colxx } from 'components/common/CustomBootstrap';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import ModalVistaPreviaEvaluacion from 'pages/app/evaluaciones/detalle-evaluacion/vista-previa-evaluacion';
import ModalRealizarEvaluacion from 'pages/app/evaluaciones/realizar-evaluacion/realizar-evaluacion-confirmar';
import ROLES from 'constants/roles';
import {
  logicDeleteDocument,
  getCollectionWithSubCollections,
  getCollection,
  getDocumentWithSubCollection,
} from 'helpers/Firebase-db';
import firebase from 'firebase/app';
import {
  desencriptarEvaluacion,
  desencriptarTexto,
} from 'handlers/DecryptionHandler';
import { isEmpty, getDateTimeStringFromDate } from 'helpers/Utils';
import * as _moment from 'moment';
const moment = _moment;

function collect(props) {
  return { data: props.data };
}

class Evaluaciones extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      arrayOriginal: [],
      modalDeleteOpen: false,
      modalPreviewOpen: false,
      modalMakeOpen: false,
      selectedItems: [],
      isLoading: true,
      materiaId: this.props.subject.id,
      eval: null,
      evalId: '',
      oldTestActive: false,
      rolDocente: this.props.rol === ROLES.Docente,
      filtroFecha: '',
    };
  }

  getEvaluaciones = async (materiaId) => {
    const arrayDeObjetos = await getCollectionWithSubCollections(
      'evaluaciones',
      [
        this.state.rolDocente
          ? {
              field: 'fecha_creacion',
              operator: '>',
              id: '',
            }
          : {
              field: 'fecha_publicacion',
              operator: '<=',
              id: firebase.firestore.Timestamp.now(),
            },
        { field: 'idMateria', operator: '==', id: materiaId },
        { field: 'activo', operator: '==', id: true },
      ],
      false,
      'ejercicios'
    );
    const evaluaciones = await desencriptarEvaluacion(arrayDeObjetos);
    console.log(evaluaciones);
    const evaluacionesActuales = evaluaciones.filter((elem) => {
      console.log(moment(elem.data.base.fecha_finalizacion));
      return moment(elem.data.base.fecha_finalizacion).isAfter(
        moment(new Date())
      );
    });
    this.dataListRenderer(evaluacionesActuales);
  };

  getEvaluacionesVencidas = async (materiaId) => {
    const arrayDeObjetos = await getCollectionWithSubCollections(
      'evaluaciones',
      [
        {
          field: 'fecha_finalizacion',
          operator: '<',
          id: firebase.firestore.Timestamp.now(),
        },
        { field: 'idMateria', operator: '==', id: materiaId },
        { field: 'activo', operator: '==', id: true },
      ],
      false,
      'ejercicios'
    );
    const evaluaciones = desencriptarEvaluacion(arrayDeObjetos);
    this.dataListRenderer(evaluaciones);
  };

  componentDidMount() {
    this.getEvaluaciones(this.state.materiaId);
  }

  toggleDeleteModal = () => {
    this.setState({
      modalDeleteOpen: !this.state.modalDeleteOpen,
    });
  };

  togglePreviewModal = () => {
    this.setState({
      modalPreviewOpen: !this.state.modalPreviewOpen,
    });
  };

  toggleMakeModal = () => {
    this.setState({
      modalMakeOpen: !this.state.modalMakeOpen,
    });
  };

  async dataListRenderer(arrayDeObjetos) {
    for (let element of arrayDeObjetos) {
      const result = await getCollection('correcciones', [
        { field: 'id_entrega', operator: '==', id: element.id },
      ]);
      element = Object.assign(
        element,
        result.length > 0 ? { entregada: true } : { entregada: false }
      );
      element.data.subcollections = element.data.subcollections.sort(
        (a, b) => a.data.numero - b.data.numero
      );
    }
    this.setState({
      items: arrayDeObjetos,
      arrayOriginal: arrayDeObjetos,
      selectedItems: [],
      isLoading: false,
    });
  }

  onEdit = (idEvaluacion) => {
    this.props.history.push(
      `/app/evaluaciones/editar-evaluacion/${idEvaluacion}`
    );
  };

  onCancel = () => {
    this.props.history.push(`/app/evaluaciones`);
  };

  onAdd = () => {
    this.props.history.push(`/app/evaluaciones/agregar`);
  };

  onDelete = (idEvaluacion) => {
    this.setState({
      evalId: idEvaluacion,
    });
    this.toggleDeleteModal();
  };

  onExport = async (idEvaluacion) => {
    const obj = await getDocumentWithSubCollection(
      `evaluaciones/${idEvaluacion}`,
      'ejercicios'
    );
    const element = document.createElement('a');
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(blob);
    const nombre = desencriptarTexto(obj.data.nombre);
    element.download = nombre + '.txt';
    element.click();
  };

  onMake = (evaluacion) => {
    this.setState((prevState) => ({
      evaluacion: evaluacion,
      evalId: evaluacion.id,
      modalMakeOpen: !prevState.modalMakeOpen,
    }));
  };

  realizarEvaluacion = () => {
    this.props.history.push({
      pathname: '/app/evaluaciones/realizar-evaluacion',
      evalId: this.state.evalId,
    });
  };

  onPreview = (idEvaluacion) => {
    this.setState({
      evalId: idEvaluacion,
    });
    this.togglePreviewModal();
  };

  borrarEvaluacion = async () => {
    await logicDeleteDocument('evaluaciones', this.state.evalId, 'Evaluación');
    this.setState({
      evalId: '',
    });
    this.toggleDeleteModal();
    this.getEvaluaciones(this.state.materiaId);
  };

  toggleOldPracticesModal = async () => {
    await this.setState({
      oldTestActive: !this.state.oldTestActive,
      isLoading: true,
    });
    if (this.state.oldTestActive) {
      this.getEvaluacionesVencidas(this.state.materiaId);
    } else {
      this.getEvaluaciones(this.state.materiaId);
    }
  };

  normalizarFecha = (fecha) => {
    let fechaNormal = getDateTimeStringFromDate(fecha).split(' ')[0];
    fechaNormal = fechaNormal.replace(/\//g, '');
    return fechaNormal;
  };

  normalizarNombre = (nombre) => {
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
    busqueda = this.normalizarNombre(busqueda);
    return busqueda;
  };

  onSearchKey = (search) => {
    const busqueda = this.normalizarBusqueda(search);
    const itemsArray = [...this.state.arrayOriginal];

    const arrayFiltrado = itemsArray.filter((elem) => {
      const fechaPublicacion = this.normalizarFecha(
        elem.data.base.fecha_publicacion
      );
      const fechaFin = this.normalizarFecha(elem.data.base.fecha_finalizacion);
      const nombre = this.normalizarNombre(elem.data.base.nombre);
      return (
        nombre.includes(busqueda) ||
        fechaPublicacion.includes(busqueda) ||
        fechaFin.includes(busqueda)
      );
    });
    this.setState({
      items: arrayFiltrado,
    });
  };

  handleClickCalendario = (date) => {
    if (date) {
      this.setState({ filtroFecha: moment(date).format('DD/MM/YYYY') });
      return this.onSearchKey({
        target: { value: moment(date).format('DDMMYYYY') },
      });
    }
    return this.setState({
      filtroFecha: '',
      items: [...this.state.arrayOriginal],
    });
  };

  handleFiltroDelete = () => {
    this.setState({
      filtroFecha: '',
      items: [...this.state.arrayOriginal],
    });
  };

  render() {
    const {
      modalDeleteOpen,
      modalMakeOpen,
      items,
      isLoading,
      modalPreviewOpen,
      evalId,
      evaluacion,
      oldTestActive,
      rolDocente,
      filtroFecha,
    } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading={
              oldTestActive ? 'menu.my-old-evaluations' : 'menu.my-evaluations'
            }
            toggleModal={rolDocente && !oldTestActive ? this.onAdd : null}
            buttonText={rolDocente && !oldTestActive ? 'evaluation.add' : null}
            secondaryToggleModal={this.toggleOldPracticesModal}
            secondaryButtonText={
              oldTestActive ? 'evaluation.active' : 'evaluation.old'
            }
          />
          <Row>
            <Colxx xxs="8" md="8">
              <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                <input
                  type="text"
                  name="keyword"
                  id="search"
                  placeholder="Búsqueda por nombre de evaluación, fecha de publicación, fecha de finalización..."
                  onChange={(e) => this.onSearchKey(e)}
                />
              </div>
            </Colxx>
            <Colxx xxs="4" md="4" className="columna-filtro-badge">
              <Badge pill className="mb-1 position-absolute badge badge-filtro">
                <Calendario
                  handleClick={this.handleClickCalendario}
                  text="Filtro por fecha de publicación o finalización"
                  evalCalendar={false}
                  filterCalendar={true}
                  id="fechasFilter"
                />
                Filtro por Fechas
                {filtroFecha && (
                  <>
                    {' '}
                    - {filtroFecha}
                    <Button
                      className="delete-filter"
                      onClick={this.handleFiltroDelete}
                      close
                    />
                  </>
                )}
              </Badge>
            </Colxx>
            {items.map((evaluacion) => {
              return (
                <CardTabs
                  key={evaluacion.id}
                  id={evaluacion.id}
                  item={evaluacion}
                  materiaId={this.state.materiaId}
                  isOldTest={this.state.oldTestActive}
                  updateEvaluaciones={this.getEvaluaciones}
                  isSelect={this.state.selectedItems.includes(evaluacion.id)}
                  collect={collect}
                  navTo={`/app/evaluaciones/detalle-evaluacion/${evaluacion.id}`}
                  onEdit={this.onEdit}
                  onDelete={this.onDelete}
                  onExport={this.onExport}
                  onMake={this.onMake}
                  onCancel={this.onCancel}
                  onPreview={this.onPreview}
                />
              );
            })}{' '}
          </Row>
          {isEmpty(items) && (
            <Row className="ml-0">
              <span>No hay resultados</span>
            </Row>
          )}
          {modalDeleteOpen && (
            <ModalConfirmacion
              texto="¿Está seguro de que desea borrar la evaluación?"
              titulo="Borrar Evaluación"
              buttonPrimary="Aceptar"
              buttonSecondary="Cancelar"
              toggle={this.toggleDeleteModal}
              isOpen={modalDeleteOpen}
              onConfirm={this.borrarEvaluacion}
            />
          )}
          {modalPreviewOpen && (
            <ModalVistaPreviaEvaluacion
              evalId={evalId}
              toggle={this.togglePreviewModal}
              isOpen={modalPreviewOpen}
            />
          )}
          {modalMakeOpen && (
            <ModalRealizarEvaluacion
              evaluacion={evaluacion}
              onConfirm={this.realizarEvaluacion}
              titulo="¿Estás seguro que deseas realizar la evaluación?"
              toggle={this.toggleMakeModal}
              isOpen={modalMakeOpen}
            />
          )}
        </div>
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

export default connect(mapStateToProps)(withRouter(Evaluaciones));
