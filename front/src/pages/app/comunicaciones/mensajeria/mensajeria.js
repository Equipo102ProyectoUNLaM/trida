import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import TabsDeMensajeria from './tabs-de-mensajeria';
import { getCollection } from 'helpers/Firebase-db';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ModalGrande from 'containers/pages/ModalGrande';
import ModalChico from 'containers/pages/ModalChico';
import FormMensaje from './form-mensaje';
import { getUsernameById } from 'helpers/Firebase-db';

class Mensajeria extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemsSent: [],
      itemsReceive: [],
      modalMessageOpen: false,
      modalEnviarOpen: false,
      modalResponderOpen: false,
      modalReenviarOpen: false,
      materiaId: this.props.subject.id,
      usuarioId: this.props.user,
      isLoading: true,
      asuntoMensaje: '',
      contenidoMensaje: '',
      fechaMensaje: '',
      botonDetalle: 'Responder',
      usuariosMail: '',
      idUsuarioAResponder: '',
      esEnviado: false,
      idMensajeAResponder: '',
    };
  }

  getMensajes = async () => {
    const mensajesEnviados = await getCollection('mensajes', [
      { field: 'emisor.id', operator: '==', id: this.state.usuarioId },
      { field: 'idMateria', operator: '==', id: this.state.materiaId },
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
      destinatarios: elem.data.general ? [] : elem.data.receptor,
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
      idRemitente: elem.data.emisor.id,
    }));
    this.setState({
      itemsReceive: arrayDeData,
      isLoading: false,
    });
  };

  getNameOfReceivers = async (arrayDeData) => {
    arrayDeData.forEach(async (mensaje, indexM) => {
      if (mensaje.destinatarios.length > 0) {
        mensaje.destinatarios.forEach(async (destinatario, indexD) => {
          let name = await getUsernameById(destinatario);
          if (arrayDeData[indexM].destinatarios.length - 1 > indexD) {
            arrayDeData[indexM].destinatarios[indexD] = name + ', ';
          } else {
            arrayDeData[indexM].destinatarios[indexD] = name;
          }
        });
      } else {
        arrayDeData[indexM].destinatarios = ['Mensaje General'];
      }
    });
    return arrayDeData;
  };

  clickOnRow = (rowInfo) => {
    let botonMensaje = 'Responder';
    let usuarios = null;
    let enviado = false;
    let idUsuarioAResponder = '';

    if (rowInfo.original.destinatarios) {
      botonMensaje = 'Reenviar';
      usuarios = rowInfo.original.destinatarios;
      enviado = true;
    } else {
      usuarios = rowInfo.original.remitente;
      idUsuarioAResponder = rowInfo.original.idRemitente;
    }

    this.setState({
      asuntoMensaje: rowInfo.original.asunto,
      contenidoMensaje: rowInfo.original.contenido,
      fechaMensaje: rowInfo.original.fecha_creacion,
      botonDetalle: botonMensaje,
      usuariosMail: usuarios,
      esEnviado: enviado,
      idUsuarioAResponder: idUsuarioAResponder,
      idMensajeAResponder: rowInfo.original.id,
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
      modalMessageOpen: false,
      modalResponderOpen: false,
    });
  };

  toggleDetailModal = () => {
    this.setState({
      modalMessageOpen: !this.state.modalMessageOpen,
    });
  };

  toggleResponderModal = () => {
    this.setState({
      modalResponderOpen: !this.state.modalResponderOpen,
      modalEnviarOpen: !this.state.modalEnviarOpen,
    });
  };

  toggleReenviarModal = () => {
    this.setState({
      modalReenviarOpen: !this.state.modalReenviarOpen,
      modalMessageOpen: false,
    });
  };

  render() {
    const {
      isLoading,
      itemsSent,
      itemsReceive,
      modalEnviarOpen,
      modalMessageOpen,
      modalReenviarOpen,
      modalResponderOpen,
      contenidoMensaje,
      asuntoMensaje,
      fechaMensaje,
      botonDetalle,
      usuariosMail,
      esEnviado,
      idUsuarioAResponder,
      idMensajeAResponder,
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
            modalHeader={
              modalResponderOpen ? 'messages.answer' : 'messages.new'
            }
          >
            <FormMensaje
              toggleModal={this.toggleModal}
              onMensajeEnviado={this.onMensajeEnviado}
              mensajeAResponder={contenidoMensaje}
              usuarioAResponder={usuariosMail}
              idUsuarioAResponder={idUsuarioAResponder}
              esResponder={modalResponderOpen}
              asuntoAResponder={asuntoMensaje}
              idMensajeAResponder={idMensajeAResponder}
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
              onConfirm={
                esEnviado ? this.toggleReenviarModal : this.toggleResponderModal
              }
            />
          )}
          {this.state.modalReenviarOpen && (
            <ModalChico
              modalOpen={modalReenviarOpen}
              toggleModal={this.toggleReenviarModal}
              modalHeader={'messages.resend'}
            >
              HOLA
            </ModalChico>
          )}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser, seleccionCurso }) => {
  const { user } = authUser;
  const { subject } = seleccionCurso;
  return { user, subject };
};

export default connect(mapStateToProps)(Mensajeria);
