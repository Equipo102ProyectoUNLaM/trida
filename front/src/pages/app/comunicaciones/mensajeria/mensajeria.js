import React, { Component, Fragment } from 'react';
import TabsDeMensajeria from './tabs-de-mensajeria';
import { getCollection } from 'helpers/Firebase-db';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import Mensajes from './mensajes';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import { injectIntl } from 'react-intl';

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
    };
  }

  getMensajes = async () => {
    const mensajesEnviados = await getCollection('mensajes', [
      { field: 'emisor', operator: '==', id: this.state.usuarioId },
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
      destinatario: elem.data.receptor,
    }));
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
      remitente: elem.data.emisor,
    }));
    this.setState({
      itemsReceive: arrayDeData,
      isLoading: false,
    });
  };

  clickOnRow = (rowInfo) => {
    this.setState({
      modalMessageOpen: true,
      asuntoMensaje: rowInfo.asunto,
      contenidoMensaje: rowInfo.contenido,
    });
    alert('delete');
  };

  render() {
    const { isLoading, itemsSent, itemsReceive } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.messages"
            // toggleModal={this.onAdd}
            buttonText="mensajes.enviar"
          />
          <TabsDeMensajeria
            clickOnRow={this.clickOnRow}
            itemsSent={itemsSent}
            itemsReceive={itemsReceive}
          />
          {this.state.modalMessageOpen && (
            <ModalConfirmacion
              texto={this.state.contenidoMensaje}
              titulo={this.state.asuntoMensaje}
              buttonPrimary="Responder"
              buttonSecondary="Cerrar"
              toggle={this.toggleDeleteModal}
              isOpen={this.state.modalMessageOpen}
              onConfirm={this.deletePractice}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(Mensajeria);
