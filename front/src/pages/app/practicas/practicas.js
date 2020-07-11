import React, { Component, Fragment } from 'react';
import { Row, Modal } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { injectIntl } from 'react-intl';
import ModalGrande from 'containers/pages/ModalGrande';
import ModalInformativo from 'containers/pages/ModalInformativo';
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
      modalDeleteOpen: false,
      selectedItems: [],
      isLoading: true,
      idItemSelected: null,
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

  deletePractice = (id) => {
    var docRef = firestore.collection('practicas').doc(id);
    try {
      docRef.remove();
    } catch (err) {
      console.log('Error getting documents', err);
    } finally {
      this.onPracticaBorrada();
    }
  };

  toggleCreateModal = () => {
    this.setState({
      ...this.state,
      modalCreateOpen: !this.state.modalCreateOpen,
    });
  };

  toggleEditModal = (id) => {
    this.setState({
      ...this.state,
      modalEditOpen: !this.state.modalEditOpen,
      idItemSelected: id,
    });
  };

  toggleDeleteModal = (id) => {
    this.setState({
      ...this.state,
      modalDeleteOpen: !this.state.modalDeleteOpen,
    });
  };

  onPracticaAgregada = () => {
    this.toggleCreateModal();
    this.getPracticas();
  };

  onPracticaEditada = () => {
    this.toggleEditModal();
    this.getPracticas();
  };

  onPracticaBorrada = () => {
    this.toggleDeleteModal();
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

  render() {
    const {
      modalCreateOpen,
      modalEditOpen,
      modalDeleteOpen,
      idItemSelected,
      isLoading,
    } = this.state;

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
              onPracticaOperacion={this.onPracticaAgregada}
              textConfirm="Agregar"
              operationType="add"
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
                  onDeleteItem={this.toggleDeleteModal}
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
                onPracticaOperacion={this.onPracticaEditada}
                textConfirm="Editar"
                operationType="edit"
                id={idItemSelected}
              />
            </ModalGrande>
          )}
          {modalDeleteOpen && (
            <ModalInformativo
              modalOpen={modalDeleteOpen}
              toggleModal={this.toggleDeleteModal}
              modalHeader="activity.delete"
              onConfirmAction="deletePractice"
            ></ModalInformativo>
          )}
        </div>
      </Fragment>
    );
  }
}
export default injectIntl(Practica);
