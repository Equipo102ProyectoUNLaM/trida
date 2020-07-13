import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import CardTabs from 'components/card-tabs';
import ModalGrande from 'containers/pages/ModalGrande';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import { firestore } from 'helpers/Firebase';
import FormEvaluacion from './form-evaluacion';
import { NotificationManager } from 'components/common/react-notifications';

function collect(props) {
  return { data: props.data };
}

class Evaluaciones extends Component {
  constructor(props) {
    super(props);

    const { id } = JSON.parse(localStorage.getItem('subject'));

    this.state = {
      items: [],
      modalOpen: false,
      modalDeleteOpen: false,
      selectedItems: [],
      isLoading: true,
      materiaId: id,
      evalId: '',
    };
  }

  getEvaluaciones = async (materiaId) => {
    const arrayDeObjetos = [];

    const evaluacionesRef = firestore
      .collection('evaluaciones')
      .where('idMateria', '==', materiaId);
    try {
      var evaluacionesSnapShot = await evaluacionesRef.get();
      evaluacionesSnapShot.forEach((doc) => {
        const docId = doc.id;
        const { nombre, fecha, descripcion } = doc.data();
        const obj = {
          id: docId,
          nombre: nombre,
          description: descripcion,
          fecha: fecha,
        };
        arrayDeObjetos.push(obj);
      });
    } catch (err) {
      console.log('Error getting documents', err);
    } finally {
      this.dataListRenderer(arrayDeObjetos);
    }
  };

  componentDidMount() {
    this.getEvaluaciones(this.state.materiaId);
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  toggleDeleteModal = () => {
    this.setState({
      modalDeleteOpen: !this.state.modalDeleteOpen,
    });
  };

  dataListRenderer(arrayDeObjetos) {
    this.setState({
      items: arrayDeObjetos,
      selectedItems: [],
      isLoading: false,
    });
  }

  onEdit = (idEvaluacion) => {
    this.props.history.push(
      `/app/evaluations/detalle-evaluacion/${idEvaluacion}`
    );
  };

  onAdd = () => {
    this.props.history.push(`/app/evaluations/agregar`);
  };

  onDelete = (idEvaluacion) => {
    this.setState({
      evalId: idEvaluacion,
    });
    this.toggleDeleteModal();
  };

  borrarEvaluacion = async () => {
    const evalRef = firestore.collection('evaluaciones').doc(this.state.evalId);
    try {
      await evalRef.delete();
    } catch (err) {
      console.log('Error deleting documents', err);
    } finally {
      NotificationManager.success(
        'Evaluación borrada!',
        'La evaluación fue borrada exitosamente',
        3000,
        null,
        null,
        ''
      );
      this.setState({
        evalId: '',
      });
      this.toggleDeleteModal();
      this.getEvaluaciones(this.state.materiaId);
    }
  };

  render() {
    const { modalOpen, modalDeleteOpen, items, isLoading } = this.state;
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
          {/* <ModalGrande
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            modalHeader="evaluacion.agregar"
          >
            <FormEvaluacion
              onEvaluacionAgregada={this.onEvaluacionAgregada}
              materiaId={this.state.materiaId}
              idEval={this.state.evalId}
            />
          </ModalGrande> */}
          <Row>
            {items.map((evaluacion) => {
              return (
                <CardTabs
                  key={evaluacion.id}
                  item={evaluacion}
                  isSelect={this.state.selectedItems.includes(evaluacion.id)}
                  collect={collect}
                  navTo={`/app/evaluations/detalle-evaluacion/${evaluacion.id}`}
                  onEdit={this.onEdit}
                  onDelete={this.onDelete}
                />
              );
            })}{' '}
          </Row>
          {modalDeleteOpen && (
            <ModalConfirmacion
              texto="Está seguro de que desea borrar la evaluación?"
              titulo="Borrar Evaluación"
              buttonPrimary="Aceptar"
              buttonSecondary="Cancelar"
              toggle={this.toggleDeleteModal}
              isOpen={modalDeleteOpen}
              onConfirm={this.borrarEvaluacion}
            />
          )}
        </div>
      </Fragment>
    );
  }
}
export default withRouter(Evaluaciones);
