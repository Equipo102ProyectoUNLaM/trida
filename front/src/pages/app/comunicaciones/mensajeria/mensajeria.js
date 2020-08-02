import React, { Component, Fragment } from 'react';
import TabsDeMensajeria from './tabs-de-mensajeria';
import { getCollection } from 'helpers/Firebase-db';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ModalGrande from 'containers/pages/ModalGrande';
import FormMensaje from './form-mensaje';
import { getDocument, getUsernameById } from 'helpers/Firebase-db';

class Mensajeria extends Component {
  constructor(props) {
    super(props);

    const { id } = JSON.parse(localStorage.getItem('subject'));

    this.state = {
      itemsSent: [],
      itemsReceive: [],
      modalMessageOpen: false,
      materiaId: id,
      usuarioId: localStorage.getItem('user_id'),
      isLoading: true,
      asuntoMensaje: '',
      contenidoMensaje: '',
      modalEnviarOpen: false,
    };
  }

  getMensajes = async () => {
    const mensajesEnviados = await getCollection('mensajes', [
      { field: 'emisor.id', operator: '==', id: this.state.usuarioId },
      { field: 'idMateria', operator: '==', id: this.state.materiaId },
      { field: 'general', operator: '==', id: false },
      { field: 'formal', operator: '==', id: false },
    ]);
    this.dataMessageSentRenderer(mensajesEnviados);

    const mensajesRecibidos = await getCollection('mensajes', [
      {
        field: 'receptor',
        operator: 'array-contains',
        id: this.state.usuarioId,
      },
      { field: 'idMateria', operator: '==', id: this.state.materiaId },
      { field: 'general', operator: '==', id: false },
      { field: 'formal', operator: '==', id: false },
    ]);
    this.dataMessageReceivedRenderer(mensajesRecibidos);
  };

  componentDidMount() {
    this.getMensajes();
  }

  dataMessageSentRenderer = (arrayDeObjetos) => {
    let arrayDeData = arrayDeObjetos.map((elem) => ({
      id: elem.id,
      asunto: elem.data.asunto,
      contenido: elem.data.contenido,
      fecha_creacion: elem.data.fecha_creacion,
      destinatarios: elem.data.receptor,
    }));
    arrayDeData = this.getNameOfReceivers(arrayDeData);

    this.setState({
      itemsSent: arrayDeData,
    });
  };

  dataMessageReceivedRenderer = (arrayDeObjetos) => {
    let arrayDeData = arrayDeObjetos.map((elem) => ({
      id: elem.id,
      asunto: elem.data.asunto,
      contenido: elem.data.contenido,
      fecha_creacion: elem.data.fecha_creacion,
      remitente: elem.data.emisor.nombre,
    }));
    this.setState({
      itemsReceive: arrayDeData,
      isLoading: false,
    });
  };

  getNameOfReceivers = (arrayDeData) => {
    arrayDeData.forEach(async (elem) => {
      elem.destinatarios.forEach(async (dest) => {
        return await getUsernameById(dest);
      });
    });

    return arrayDeData;
  };

  clickOnRow = (rowInfo) => {
    this.setState({
      asuntoMensaje: rowInfo.original.asunto,
      contenidoMensaje: rowInfo.original.contenido,
    });
    this.toggleDetailModal();
  };

  onMensajeEnviado = () => {
    this.toggleModal();
    this.getMensajes();
  };

  toggleModal = () => {
    this.setState({
      modalEnviarOpen: !this.state.modalEnviarOpen,
    });
  };

  toggleDetailModal = () => {
    this.setState({
      modalMessageOpen: !this.state.modalMessageOpen,
    });
  };

  render() {
    const {
      isLoading,
      itemsSent,
      itemsReceive,
      modalEnviarOpen,
      contenidoMensaje,
      asuntoMensaje,
      modalMessageOpen,
    } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.messages"
            toggleModal={this.toggleModal}
            buttonText="messages.new"
          />
          <ModalGrande
            modalOpen={modalEnviarOpen}
            toggleModal={this.toggleModal}
            modalHeader="messages.new"
          >
            <FormMensaje
              toggleModal={this.toggleModal}
              onMensajeEnviado={this.onMensajeEnviado}
            />
          </ModalGrande>
          <TabsDeMensajeria
            clickOnRow={this.clickOnRow}
            itemsSent={itemsSent}
            itemsReceive={itemsReceive}
          />
          {this.state.modalMessageOpen && (
            <ModalConfirmacion
              texto={contenidoMensaje}
              titulo={asuntoMensaje}
              buttonPrimary="Responder"
              buttonSecondary="Cerrar"
              toggle={this.toggleDetailModal}
              isOpen={modalMessageOpen}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(Mensajeria);
