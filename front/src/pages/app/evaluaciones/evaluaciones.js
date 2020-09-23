import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import CardTabs from 'components/card-tabs';
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
      rolDocente: this.props.rol === ROLES.Docente,
    };
  }

  getEvaluaciones = async (materiaId) => {
    const arrayDeObjetos = await getCollectionWithSubCollections(
      'evaluaciones',
      [
        this.props.rol === ROLES.Docente
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

  onSearchKey = (search) => {
    const { target } = search;
    const { value } = target;
    let busqueda = value.toLowerCase();
    const itemsArray = [...this.state.arrayOriginal];

    busqueda = busqueda.replace(/\//g, '');
    busqueda = busqueda.replace(/-/g, '');

    const arrayFiltrado = itemsArray.filter((elem) => {
      let fechaPublicacion = getDateTimeStringFromDate(
        elem.data.base.fecha_publicacion
      ).split(' ')[0];
      let fechaFin = getDateTimeStringFromDate(
        elem.data.base.fecha_finalizacion
      ).split(' ')[0];
      fechaPublicacion = fechaPublicacion.replace(/\//g, '');
      fechaFin = fechaFin.replace(/\//g, '');
      return (
        elem.data.base.nombre.toLowerCase().includes(busqueda) ||
        fechaPublicacion.includes(busqueda) ||
        fechaFin.includes(busqueda)
      );
    });
    this.setState({
      items: arrayFiltrado,
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
      rolDocente,
    } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.evaluations"
            toggleModal={rolDocente ? this.onAdd : null}
            buttonText={rolDocente ? 'evaluation.add' : null}
          />
          <Row>
            {rolDocente && (
              <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                <input
                  type="text"
                  name="keyword"
                  id="search"
                  placeholder="Búsqueda por nombre de evaluación, fecha de publicación, fecha de finalización..."
                  onChange={(e) => this.onSearchKey(e)}
                  autoComplete="off"
                />
              </div>
            )}
            {items.map((evaluacion) => {
              return (
                <CardTabs
                  key={evaluacion.id}
                  item={evaluacion}
                  materiaId={this.state.materiaId}
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
