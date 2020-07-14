import React, { Component, Fragment } from 'react';
import { Row, Modal } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { injectIntl } from 'react-intl';
import ModalGrande from 'containers/pages/ModalGrande';
import FormPractica from './form-practica';
import DataListView from 'containers/pages/DataListView';
import { getCollection } from 'helpers/Firebase-db';
import * as moment from 'moment';

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
      idItemSelected: null,
    };
  }

  getPracticas = async () => {
    const arrayDeObjetos = await getCollection(
      'practicas',
      'fechaLanzada',
      '>',
      moment().format('DD/MM/AAAA'),
      'fechaLanzada',
      'asc'
    );
    this.dataListRenderer(arrayDeObjetos);
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

  toggleEditModal = (id) => {
    this.setState({
      ...this.state,
      modalEditOpen: !this.state.modalEditOpen,
      idItemSelected: id,
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
    const {
      modalCreateOpen,
      modalEditOpen,
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
              return (
                <DataListView
                  key={practica.id + 'dataList'}
                  id={practica.id}
                  title={practica.data.nombre}
                  text1={
                    'Fecha de publicación: ' + practica.data.fechaPublicada
                  }
                  text2={'Fecha de entrega: ' + practica.data.fechaVencimiento}
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
                onPracticaOperacion={this.onPracticaEditada}
                textConfirm="Editar"
                operationType="edit"
                id={idItemSelected}
              />
            </ModalGrande>
          )}
        </div>
      </Fragment>
    );
  }
}
export default injectIntl(Practica);
