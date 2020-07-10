import React, { Component, Fragment } from 'react';
import { Row, Modal } from 'reactstrap';
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
      modalCreateOpen: false,
      modalEditOpen: false,
      selectedItems: [],
      isLoading: true,
    };
  }

  getPracticas = async () => {
    const arrayDeObjetos = [];
    const actividadesRef = firestore
      .collection('practicas')
      .where('fechaLanzada', '>', new Date().toISOString().slice(0, 10))
      .orderBy('fechaLanzada', 'asc');
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

  toggleCreateModal = () => {
    this.setState({
      ...this.state,
      modalCreateOpen: !this.state.modalCreateOpen,
    });
  };

  toggleEditModal = () => {
    this.setState({
      ...this.state,
      modalEditOpen: !this.state.modalEditOpen,
    });
  };

  onPracticaAgregada = () => {
    this.toggleCreateModal();
    this.getPracticas();
  };

  dataListRenderer(arrayDeObjetos) {
    this.setState({
      items: arrayDeObjetos,
      selectedItems: [],
      isLoading: false,
      modalCreateOpen: false,
      modalEditOpen: false,
    });
  }

  deleteItem = () => {
    alert('delete');
  };

  render() {
    const { modalCreateOpen, modalEditOpen, items, isLoading } = this.state;

    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.my-activities"
            toggleModal={this.toggleCreateModal}
            buttonText="activity.add"
          />
          <ModalGrande
            modalOpen={modalCreateOpen}
            toggleModal={this.toggleCreateModal}
            modalHeader="activity.add"
          >
            <FormPractica
              toggleModal={this.toggleCreateModal}
              onPracticaAgregada={this.onPracticaAgregada}
              textConfirm="Agregar"
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
                  onEditItem={this.toggleEditModal}
                  onDeleteItem={this.deleteItem}
                  navTo="#"
                  collect={collect}
                />
              );
            })}{' '}
          </Row>
          {modalEditOpen && (
            <ModalGrande
              modalOpen={modalEditOpen}
              toggleModal={this.toggleEditModal}
              modalHeader="activity.edit"
            >
              <FormPractica
                toggleModal={this.toggleEditModal}
                onPracticaAgregada={this.onPracticaAgregada}
                textConfirm="Editar"
              />
            </ModalGrande>
          )}
        </div>
      </Fragment>
    );
  }
}
export default injectIntl(Practica);
