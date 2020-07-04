import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { injectIntl } from 'react-intl';
import ModalGrande from 'containers/pages/ModalGrande';
import FormPractica from './form-practica';
import { firestore } from 'helpers/Firebase';
import DataListView from 'containers/pages/DataListView';

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
      isLoading: true,
    };
  }

  getPracticas = async () => {
    const arrayDeObjetos = [];
    const actividadesRef = firestore.collection('practicas');
    try {
      var allActivitiesSnapShot = await actividadesRef.get();
      allActivitiesSnapShot.forEach((doc) => {
        const docId = doc.id;
        const {
          nombre,
          fechaLanzada,
          fechaVencimiento,
          descripcion,
        } = doc.data();
        const obj = {
          id: docId,
          name: nombre,
          description: descripcion,
          startDate: fechaLanzada,
          dueDate: fechaVencimiento,
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
      isLoading: false,
      modalOpen: false,
    });
  }

  deleteItem = () => {
    alert('delete');
  };

  editItem = () => {
    alert('edit');
  };

  render() {
    const { modalOpen, items, isLoading } = this.state;
    console.log(items);

    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.my-activities"
            toggleModal={this.toggleModal}
            buttonText="activity.add"
          />
          <ModalGrande
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            modalHeader="activity.add"
          >
            <FormPractica
              toggleModal={this.toggleModal}
              onPracticaAgregada={this.onPracticaAgregada}
            />
          </ModalGrande>
          <Row>
            {this.state.items.map((practica) => {
              return (
                <DataListView
                  key={practica.id + 'dataList'}
                  id={practica.id}
                  title={practica.name}
                  text1={'Fecha de publicación: ' + practica.startDate}
                  text2={'Fecha de entrega: ' + practica.dueDate}
                  isSelect={this.state.selectedItems.includes(practica.id)}
                  onEditItem={this.editItem}
                  onDeleteItem={this.deleteItem}
                  navTo="#"
                  collect={collect}
                />
              );
            })}{' '}
          </Row>
        </div>
      </Fragment>
    );
  }
}
export default injectIntl(Practica);
