import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import CardTabs from 'components/card-tabs';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import ModalVistaPreviaEvaluacion from 'pages/app/evaluaciones/detalle-evaluacion/vista-previa-evaluacion';
import {
  logicDeleteDocument,
  getCollectionWithSubCollections,
} from 'helpers/Firebase-db';

function collect(props) {
  return { data: props.data };
}

class Evaluaciones extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      modalDeleteOpen: false,
      modalPreviewOpen: false,
      selectedItems: [],
      isLoading: true,
      materiaId: this.props.subject.id,
      evalId: '',
    };
  }

  getEvaluaciones = async (materiaId) => {
    const arrayDeObjetos = await getCollectionWithSubCollections(
      'evaluaciones',
      [
        { field: 'idMateria', operator: '==', id: materiaId },
        { field: 'activo', operator: '==', id: true },
      ],
      false,
      'ejercicios'
    );
    this.dataListRenderer(arrayDeObjetos);
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

  dataListRenderer(arrayDeObjetos) {
    arrayDeObjetos.forEach((element) => {
      element.data.subcollections = element.data.subcollections.sort(
        (a, b) => a.data.numero - b.data.numero
      );
    });
    this.setState({
      items: arrayDeObjetos,
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

  render() {
    const {
      modalDeleteOpen,
      items,
      isLoading,
      modalPreviewOpen,
      evalId,
    } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.evaluations"
            toggleModal={this.onAdd}
            buttonText="evaluacion.agregar"
          />
          <Row>
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
                  onCancel={this.onCancel}
                  onPreview={this.onPreview}
                />
              );
            })}{' '}
          </Row>
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
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ seleccionCurso }) => {
  const { subject } = seleccionCurso;
  return { subject };
};

export default connect(mapStateToProps)(withRouter(Evaluaciones));
