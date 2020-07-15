import React, { Component, Fragment } from 'react';
import { Row, Modal } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { injectIntl } from 'react-intl';
import ModalGrande from 'containers/pages/ModalGrande';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import FormPractica from './form-practica';
import { firestore } from 'helpers/Firebase';
import DataListView from 'containers/pages/DataListView';
import { NotificationManager } from 'components/common/react-notifications';

function collect(props) {
  return { data: props.data };
}

class Practica extends Component {
  constructor(props) {
    super(props);

    const { id } = JSON.parse(localStorage.getItem('subject'));

    this.state = {
      items: [],
      modalCreateOpen: false,
      modalEditOpen: false,
      modalDeleteOpen: false,
      selectedItems: [],
      isLoading: true,
      idItemSelected: null,
      practicaId: '',
      idMateria: id,
    };
  }

  getPracticas = async (materiaId) => {
    const arrayDeObjetos = [];
    const actividadesRef = firestore
      .collection('practicas')
      .where('fechaLanzada', '>', new Date().toISOString().slice(0, 10))
      // .where('idMateria', '==', materiaId)
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
    this.getPracticas(this.state.idMateria);
  }

  toggleCreateModal = () => {
    this.setState({
      modalCreateOpen: !this.state.modalCreateOpen,
    });
  };

  onPracticaAgregada = () => {
    this.toggleCreateModal();
    this.getPracticas(this.state.idMateria);
  };

  toggleEditModal = (id) => {
    this.setState({
      modalEditOpen: !this.state.modalEditOpen,
      idItemSelected: id,
    });
  };

  onPracticaEditada = () => {
    this.toggleEditModal();
    this.getPracticas(this.state.idMateria);
  };

  toggleDeleteModal = (id) => {
    this.setState({
      modalDeleteOpen: !this.state.modalDeleteOpen,
    });
  };

  onDelete = (idPractica) => {
    this.setState({
      practicaId: idPractica,
    });
    this.toggleDeleteModal();
  };

  deletePractice = async () => {
    var practicaRef = firestore
      .collection('practicas')
      .doc(this.state.practicaId);
    try {
      await practicaRef.delete();
    } catch (err) {
      console.log('Error getting documents', err);
    } finally {
      NotificationManager.success(
        'Práctica borrada!',
        'La práctica fue borrada exitosamente',
        3000,
        null,
        null,
        ''
      );
      this.setState({
        practicaId: '',
      });
      this.onPracticaBorrada();
    }
  };

  onPracticaBorrada = () => {
    this.toggleDeleteModal();
    this.getPracticas(this.state.idMateria);
  };

  dataListRenderer(arrayDeObjetos) {
    this.setState({
      items: arrayDeObjetos,
      selectedItems: [],
      isLoading: false,
      modalCreateOpen: false,
      modalEditOpen: false,
      practicaId: '',
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
              idMateria={this.state.idMateria}
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
                  onDelete={this.onDelete}
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
            <ModalConfirmacion
              texto="¿Está seguro de que desea borrar la práctica?"
              titulo="Borrar Práctica"
              buttonPrimary="Aceptar"
              buttonSecondary="Cancelar"
              toggle={this.toggleDeleteModal}
              isOpen={modalDeleteOpen}
              onConfirm={this.deletePractice}
            />
          )}
        </div>
      </Fragment>
    );
  }
}
export default injectIntl(Practica);
