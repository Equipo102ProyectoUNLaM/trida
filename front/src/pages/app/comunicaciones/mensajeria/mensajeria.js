import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import TabsDeMensajeria from './tabs-de-mensajeria';
import { getCollection } from 'helpers/Firebase-db';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ModalGrande from 'containers/pages/ModalGrande';
import FormMensaje from './form-mensaje';
import { getUsernameById } from 'helpers/Firebase-db';

class Mensajeria extends Component {
  constructor(props) {
    super(props);

    const { id } = localStorage.getItem('subject');

    this.state = {
      itemsSent: [],
      itemsReceive: [],
      modalMessageOpen: false,
      materiaId: id,
      usuarioId: this.props.user,
      isLoading: true,
      asuntoMensaje: '',
      contenidoMensaje: '',
      fechaMensaje: '',
      botonDetalle: 'Responder',
      usuariosMail: '',
      modalEnviarOpen: false,
      esEnviado: false,
    };
  }

  getMensajes = async () => {
    const mensajesEnviados = await getCollection('mensajes', [
      { field: 'emisor.id', operator: '==', id: this.state.usuarioId },
      { field: 'idMateria', operator: '==', id: this.state.materiaId },
      { field: 'general', operator: '==', id: false },
      { field: 'formal', operator: '==', id: false },
    ]);
    await this.dataMessageSentRenderer(mensajesEnviados);

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

  dataMessageSentRenderer = async (arrayDeObjetos) => {
    let arrayDeData = arrayDeObjetos.map((elem) => ({
      id: elem.id,
      asunto: elem.data.asunto,
      contenido: elem.data.contenido,
      fecha_creacion: elem.data.fecha_creacion,
      destinatarios: elem.data.receptor,
    }));
    arrayDeData = await this.getNameOfReceivers(arrayDeData);
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

  getNameOfReceivers = async (arrayDeData) => {
    arrayDeData.forEach(async (mensaje, indexM) => {
      mensaje.destinatarios.forEach(async (destinatario, indexD) => {
        let name = await getUsernameById(destinatario);
        if (arrayDeData[indexM].destinatarios.length - 1 > indexD) {
          arrayDeData[indexM].destinatarios[indexD] = name + ', ';
        } else {
          arrayDeData[indexM].destinatarios[indexD] = name;
        }
      });
    });
    return arrayDeData;
  };

  clickOnRow = (rowInfo) => {
    let botonMensaje = 'Responder';
    let usuarios = null;
    let enviado = false;
    if (rowInfo.original.destinatarios) {
      botonMensaje = 'Reenviar';
      usuarios = rowInfo.original.destinatarios;
      enviado = true;
    } else {
      usuarios = rowInfo.original.remitente;
    }
    this.setState({
      asuntoMensaje: rowInfo.original.asunto,
      contenidoMensaje: rowInfo.original.contenido,
      fechaMensaje: rowInfo.original.fecha_creacion,
      botonDetalle: botonMensaje,
      usuariosMail: usuarios,
      esEnviado: enviado,
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
      fechaMensaje,
      botonDetalle,
      usuariosMail,
      esEnviado,
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
              fecha={fechaMensaje}
              usuarios={usuariosMail}
              esEnviado={esEnviado}
              buttonPrimary={botonDetalle}
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

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return { user };
};

export default connect(mapStateToProps)(Mensajeria);
