import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ListaConImagen from 'components/lista-con-imagen';
import ModalGrande from 'containers/pages/ModalGrande';
import { evaluacion } from 'data/evaluacion';

function collect(props) {
  return { data: props.data };
}

class Evaluaciones extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      modalOpen: false,
      selectedItems: [],
      isLoading: true,
    };
  }

  getEvaluaciones = async () => {
    this.dataListRenderer(evaluacion);
  };

  componentDidMount() {
    this.getEvaluaciones();
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  onEvaluacionAgregada = () => {
    this.toggleModal();
    this.getEvaluaciones();
  };

  dataListRenderer(arrayDeObjetos) {
    this.setState({
      items: arrayDeObjetos,
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
            heading="menu.evaluations"
            toggleModal={this.toggleModal}
            buttonText="evaluacion.agregar"
          />
          <ModalGrande
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            modalHeader="evaluacion.agregar"
          >
            {/* Acá va el form de evaluaciones */}
            {/* <FormClase
              toggleModal={this.toggleModal}
              onClaseAgregada={this.onClaseAgregada}
            /> */}
          </ModalGrande>
          <Row>
            {items.map((evaluacion) => {
              return (
                <ListaConImagen
                  key={evaluacion.id}
                  item={evaluacion}
                  isSelect={this.state.selectedItems.includes(evaluacion.id)}
                  collect={collect}
                  navTo={`/app/evaluaciones/detalle-evaluacion/${evaluacion.id}`}
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
