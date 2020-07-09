import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import contents from 'data/contents';
import Contents from 'containers/dashboards/contents';

function collect(props) {
  return { data: props.data };
}

class Contenidos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      selectedItems: [],
      isLoading: true,
    };
  }

  // Esto va a hacer el get del storage para la materia
  getContenidos = async () => {
    this.dataListRenderer(contents);
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
            heading="menu.content"
            toggleModal={this.toggleModal}
            buttonText="contenido.agregar"
          />
          <Row>
            <Contents data={contents} />{' '}
          </Row>
        </div>
      </Fragment>
    );
  }
}
export default injectIntl(Contenidos);
