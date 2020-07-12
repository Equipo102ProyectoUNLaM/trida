import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import CardTabs from 'components/card-tabs';
import ModalGrande from 'containers/pages/ModalGrande';
import { firestore } from 'helpers/Firebase';
import FormEvaluacion from './form-evaluacion';

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
      selectedItems: [],
      isLoading: true,
      materiaId: id,
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
          name: nombre,
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

  onEvaluacionAgregada = () => {
    this.toggleModal();
    this.getEvaluaciones(this.state.materiaId);
  };

  dataListRenderer(arrayDeObjetos) {
    this.setState({
      items: arrayDeObjetos,
      selectedItems: [],
      isLoading: false,
    });
  }

  onEdit = (idEvaluacion) => {
    console.log('edit' + idEvaluacion);
  };

  render() {
    const { modalOpen, items, isLoading } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.evaluations"
            toggleModal={this.toggleModal}
            buttonText="evaluacion.agregar"
          />
          <ModalGrande
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            modalHeader="evaluacion.agregar"
          >
            <FormEvaluacion
              toggleModal={this.toggleModal}
              onEvaluacionAgregada={this.onEvaluacionAgregada}
              materiaId={this.state.materiaId}
            />
          </ModalGrande>
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
                />
              );
            })}{' '}
          </Row>
        </div>
      </Fragment>
    );
  }
}
export default injectIntl(Evaluaciones);
