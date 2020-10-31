import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import TabsDeFormales from './tabs-de-formales';
import { getCollection } from 'helpers/Firebase-db';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ModalGrande from 'containers/pages/ModalGrande';
import FormFormales from './form-formal';
import { addDocument } from 'helpers/Firebase-db';
import { desencriptarTexto } from 'handlers/DecryptionHandler';
import { encriptarTexto } from 'handlers/EncryptionHandler';
import ROLES from 'constants/roles';

class Formales extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemsSent: [],
      itemsReceive: [],
      selectedOptions: [],
      modalMessageOpen: false,
      modalEnviarOpen: false,
      materiaId: this.props.subject.id,
      usuarioId: this.props.user,
      isLoading: true,
      asuntoMensaje: '',
      contenidoMensaje: '',
      fechaMensaje: '',
      botonDetalle: 'Responder',
      usuariosMail: '',
      esEnviado: false,
    };
  }

  async componentDidMount() {
    this.getMensajes();
  }

  getMensajes = async () => {
    this.setState({
      itemsReceive: [],
    });
    const mensajesRecibidos = await getCollection(
      'formales',
      [
        {
          field: 'receptor',
          operator: 'array-contains',
          id: this.state.usuarioId,
        },
        { field: 'idMateria', operator: '==', id: this.state.materiaId },
      ],
      [{ order: 'fecha_creacion', orderCond: 'asc' }]
    );
    const mensajesRecibidosDirectivo = await getCollection(
      'formales',
      [
        {
          field: 'receptor',
          operator: 'array-contains',
          id: this.state.usuarioId,
        },
        {
          field: 'emisor.id',
          operator: '>',
          id: this.state.usuarioId,
        },
        {
          field: 'emisor.id',
          operator: '<',
          id: this.state.usuarioId,
        },
        { field: 'idMateria', operator: '==', id: this.state.materiaId },
      ],
      [
        { order: 'emisor.id', orderCond: 'asc' },
        { order: 'fecha_creacion', orderCond: 'asc' },
      ]
    );

    this.props.rol === ROLES.Directivo
      ? this.dataMessageReceivedRenderer(mensajesRecibidosDirectivo)
      : this.dataMessageReceivedRenderer(mensajesRecibidos);

    const mensajesEnviados = await getCollection(
      'formales',
      [
        { field: 'emisor.id', operator: '==', id: this.state.usuarioId },
        { field: 'idMateria', operator: '==', id: this.state.materiaId },
      ],
      [{ order: 'fecha_creacion', orderCond: 'asc' }]
    );
    await this.dataMessageSentRenderer(mensajesEnviados);

    await this.orderMessages();
  };

  getRolesReceptores = (roles) => {
    let dest = '';
    if (roles.length > 1) {
      roles.map((rol) => {
        dest = dest + rol + ', ';
      });

      return dest.slice(0, [dest.length - 2]);
    }
    return roles;
  };

  dataMessageSentRenderer = async (arrayDeObjetos) => {
    let arrayDeData = arrayDeObjetos.map((elem) => {
      const destinatarios = this.getRolesReceptores(elem.data.rolesReceptores);
      return {
        id: elem.id,
        asunto: elem.data.asunto,
        contenido: elem.data.contenido,
        fecha_creacion: elem.data.fecha_creacion,
        destinatarios,
      };
    });
    this.setState({
      itemsSent: arrayDeData,
      isLoading: false,
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

    const data = this.state.itemsReceive;
    if (arrayDeData.length > 0) {
      arrayDeData.forEach(async (message) => {
        data.push(message);
      });
    }
    this.setState({
      itemsReceive: data,
    });
  };

  orderMessages = async () => {
    const recibidos = this.state.itemsReceive.sort(
      (a, b) => a.fecha_creacion - b.fecha_creacion
    );
    const enviado = this.state.itemsSent.sort(
      (a, b) => a.fecha_creacion - b.fecha_creacion
    );

    this.setState({
      itemsReceive: recibidos,
      itemsSent: enviado,
    });
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
      contenidoMensaje: desencriptarTexto(rowInfo.original.contenido),
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
      modalMessageOpen: false,
    });
  };

  toggleDetailModal = () => {
    this.setState({
      modalMessageOpen: !this.state.modalMessageOpen,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    let receptores = this.state.selectedOptions.map(({ value }) => value);

    const msg = {
      emisor: {
        id: this.state.usuarioId,
        nombre: this.props.nombre + ' ' + this.props.apellido,
      },
      receptor: receptores,
      contenido: encriptarTexto(this.state.contenidoMensaje),
      asunto: this.state.asuntoMensaje,
      formal: false,
      general: false,
      idMateria: this.state.materiaId,
    };
    //guardar msj en bd
    await addDocument(
      'mensajes',
      msg,
      this.props.user,
      'Mensaje reenviado',
      'Mensaje reenviado exitosamente',
      'Error al reenviar el mensaje'
    );

    this.toggleReenviarModal();
    this.setState({
      selectedOptions: [],
    });
    this.getMensajes();
  };

  render() {
    const {
      isLoading,
      itemsSent,
      itemsReceive,
      modalEnviarOpen,
      modalMessageOpen,
      contenidoMensaje,
      asuntoMensaje,
      fechaMensaje,
      usuariosMail,
      esEnviado,
    } = this.state;
    const rolDirectivo = this.props.rol === ROLES.Directivo;

    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.formal"
            toggleModal={this.toggleModal}
            buttonText={rolDirectivo ? 'formales.nueva' : ''}
          />
          <ModalGrande
            modalOpen={modalEnviarOpen}
            toggleModal={this.toggleModal}
            modalHeader={'formales.nueva'}
          >
            <FormFormales
              toggleModal={this.toggleModal}
              onMensajeEnviado={this.onMensajeEnviado}
            />
          </ModalGrande>
          <TabsDeFormales
            clickOnRow={this.clickOnRow}
            itemsSent={itemsSent}
            itemsReceive={itemsReceive}
            rolDirectivo={rolDirectivo}
          />
          {this.state.modalMessageOpen && (
            <ModalConfirmacion
              texto={contenidoMensaje}
              titulo={asuntoMensaje}
              fecha={fechaMensaje}
              usuarios={usuariosMail}
              esEnviado={esEnviado}
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

const mapStateToProps = ({ authUser, seleccionCurso }) => {
  const { user, userData } = authUser;
  const { nombre, apellido, rol } = userData;
  const { subject } = seleccionCurso;
  return { user, subject, nombre, apellido, rol };
};

export default connect(mapStateToProps)(Formales);
