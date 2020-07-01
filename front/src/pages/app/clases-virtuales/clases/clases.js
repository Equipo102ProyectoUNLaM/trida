import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ListaConImagen from 'components/lista-con-imagen';
import ModalGrande from 'containers/pages/ModalGrande';
import FormClase from './form-clase';
import { firestore } from 'helpers/Firebase';

function collect(props) {
  return { data: props.data };
}

class Clase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      modalOpen: false,
      selectedItems: [],
      isLoading: false,
    };
  }

  getClases = async () => {
    const arrayDeObjetos = [];
    const clasesRef = firestore.collection('clases');
    try {
      var allClasesSnapShot = await clasesRef.get();
      allClasesSnapShot.forEach((doc) => {
        const docId = doc.id;
        const { nombre, fecha, descripcion } = doc.data();
        const obj = {
          id: docId,
          nombre: nombre,
          descripcion: descripcion,
          fecha: fecha,
          imagen:
            'https://image.freepik.com/free-vector/online-education-illustration-tablet-notes-pencil-education-icon-concept-white-isolated_138676-631.jpg',
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
    this.getClases();
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  onClaseAgregada = () => {
    this.toggleModal();
    this.getClases();
  };

  dataListRenderer(arrayDeObjetos) {
    this.setState({
      items: arrayDeObjetos,
      selectedItems: [],
      isLoading: true,
    });
  }

  render() {
    const { modalOpen, items } = this.state;

    return !this.state.isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.my-classes"
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
                  isSelect={this.state.selectedItems.includes(clase.id)}
                  collect={collect}
                  navTo={`class-detail/${clase.id}`}
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
