import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ListaConImagen from 'components/lista-con-imagen';
import ModalGrande from 'containers/pages/ModalGrande';
import FormClase from './form-clase';
import { getCollection } from 'helpers/Firebase-db';
const publicUrl = process.env.PUBLIC_URL;
const imagenClase = `${publicUrl}/assets/img/imagen-clase.jpeg`;

function collect(props) {
  return { data: props.data };
}

class Clase extends Component {
  constructor(props) {
    super(props);

    const { id } = JSON.parse(localStorage.getItem('subject'));

    this.state = {
      items: [],
      modalOpen: false,
      selectedItems: [],
      isLoading: true,
      idMateria: id,
    };
  }

  getClases = async (materiaId) => {
    const arrayDeObjetos = await getCollection('clases', [
      { field: 'idMateria', operator: '==', id: materiaId },
    ]);
    this.dataListRenderer(arrayDeObjetos);
  };

  componentDidMount() {
    this.getClases(this.state.idMateria);
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  onClaseAgregada = () => {
    this.toggleModal();
    this.getClases(this.state.idMateria);
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
            heading="menu.mis-clases"
            toggleModal={this.toggleModal}
            buttonText="classes.add"
          />
          <ModalGrande
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            modalHeader="classes.add"
          >
            <FormClase
              toggleModal={this.toggleModal}
              onClaseAgregada={this.onClaseAgregada}
            />
          </ModalGrande>
          <Row>
            {items.map((clase) => {
              return (
                <ListaConImagen
                  key={clase.id}
                  item={clase}
                  imagen={imagenClase}
                  isSelect={this.state.selectedItems.includes(clase.id)}
                  collect={collect}
                  navTo={`/app/clases-virtuales/mis-clases/detalle-clase/${clase.id}`}
                />
              );
            })}{' '}
          </Row>
        </div>
      </Fragment>
    );
  }
}
export default injectIntl(Clase);
