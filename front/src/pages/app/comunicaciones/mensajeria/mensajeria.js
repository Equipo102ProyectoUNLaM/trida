import React, { Component, Fragment } from 'react';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ModalGrande from 'containers/pages/ModalGrande';
import FormMensaje from './form-mensaje';

export default class Mensajeria extends Component {
  constructor(props) {
    super(props);

    const { id } = JSON.parse(localStorage.getItem('subject'));

    this.state = {
      items: [],
      modalOpen: false,
      selectedItems: [],
      isLoading: true,
    };
  }

  onMensajeEnviado = () => {
    this.toggleModal();
    //this.getMensajes(this.state.idUser); => Acá se deberìa hacer un render de los msjs enviados/recibidos del usuario
  };

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  render() {
    const { modalOpen, items, isLoading } = this.state;
    return (
      <Fragment>
        <HeaderDeModulo
          heading="menu.messages"
          toggleModal={this.toggleModal}
          buttonText="messages.new"
        />
        <ModalGrande
          modalOpen={modalOpen}
          toggleModal={this.toggleModal}
          modalHeader="messages.new"
        >
          <FormMensaje
            toggleModal={this.toggleModal}
            onMensajeEnviado={this.onMensajeEnviado}
          />
        </ModalGrande>
      </Fragment>
    );
  }
}
