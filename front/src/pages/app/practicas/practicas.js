import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { injectIntl } from 'react-intl';
import ModalGrande from 'containers/pages/ModalGrande';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import FormPractica from './form-practica';
import DataListView from 'containers/pages/DataListView';
import { getCollection, logicDeleteDocument } from 'helpers/Firebase-db';
import { toDateTime } from 'helpers/Utils';

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
      practicaId: '',
    };
  }

  getPracticas = async () => {
    const date = new Date().toISOString().slice(0, 10);
    const arrayDeObjetos = await getCollection(
      'practicas',
      'fechaLanzada',
      '>',
      date,
      'fechaLanzada',
      'asc'
    );
    console.log(arrayDeObjetos);
    this.dataListRenderer(arrayDeObjetos);
  };

  componentDidMount() {
    this.getPracticas();
  }

  toggleCreateModal = () => {
    this.setState({
      modalCreateOpen: !this.state.modalCreateOpen,
    });
  };

  onPracticaAgregada = () => {
    this.toggleCreateModal();
    this.getPracticas();
  };

  toggleEditModal = (id) => {
    this.setState({
      modalEditOpen: !this.state.modalEditOpen,
      idItemSelected: id,
    });
  };

  onPracticaEditada = () => {
    this.toggleEditModal();
    this.getPracticas();
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
    await logicDeleteDocument('practicas', this.state.practicaId, 'Práctica');
    this.setState({
      evalId: '',
    });

    this.setState({
      practicaId: '',
    });
    this.onPracticaBorrada();
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
      items,
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
            {items.map((practica) => {
              const fechaPublicada = toDateTime(
                practica.data.fechaPublicada.seconds
              );
              return (
                <DataListView
                  key={practica.id + 'dataList'}
                  id={practica.id}
                  title={practica.data.nombre}
                  text1={'Fecha de publicación: ' + fechaPublicada}
                  text2={'Fecha de entrega: ' + practica.data.fechaVencimiento}
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
