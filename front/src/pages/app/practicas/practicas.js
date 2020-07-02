import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { injectIntl } from 'react-intl';
import ModalGrande from 'containers/pages/ModalGrande';
import FormPractica from './form-practica';
import { firestore } from 'helpers/Firebase';

function collect(props) {
  return { data: props.data };
}

class Practica extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      modalOpen: false,
      selectedItems: [],
      isLoading: false,
    };
  }

  getPracticas = async () => {
    const arrayDeObjetos = [];
    const clasesRef = firestore.collection('practicas');
    try {
      var allClasesSnapShot = await clasesRef.get();
      allClasesSnapShot.forEach((doc) => {
        const docId = doc.id;
        const { nombre, fechaLanzada, descripcion } = doc.data();
        const obj = {
          id: docId,
          nombre: nombre,
          descripcion: descripcion,
          fecha: fechaLanzada,
          imagen: 'https://shorturl.at/dfjN0',
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
    this.getPracticas();
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  onPracticaAgregada = () => {
    this.toggleModal();
    this.getPracticas();
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
    console.log(items);
    return !this.state.isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.my-activities"
            toggleModal={this.toggleModal}
            buttonText="practices.add"
          />
          <ModalGrande
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            modalHeader="practices.add"
          >
            <FormPractica
              toggleModal={this.toggleModal}
              onPracticaAgregada={this.onPracticaAgregada}
            />
          </ModalGrande>
        </div>
      </Fragment>
    );
  }
}
export default injectIntl(Practica);
