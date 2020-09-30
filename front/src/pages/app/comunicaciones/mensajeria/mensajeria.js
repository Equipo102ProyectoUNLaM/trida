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
import Select from 'react-select';
import { getUsersOfSubject } from 'helpers/Firebase-user';
import { Colxx } from 'components/common/CustomBootstrap';
import { Row, ModalFooter, Button, Input } from 'reactstrap';
import { addDocument } from 'helpers/Firebase-db';
import { desencriptarTexto } from 'handlers/DecryptionHandler';
import { encriptarTexto } from 'handlers/EncryptionHandler';

class Mensajeria extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemsSent: [],
      itemsReceive: [],
      datosUsuarios: [],
      selectedOptions: [],
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

  async componentDidMount() {
    const datos = await getUsersOfSubject(
      this.state.materiaId,
      this.state.usuarioId
    );
    this.setState({
      datosUsuarios: datos,
    });
    this.getMensajes();
  }

  getMensajes = async () => {
    this.setState({
      itemsReceive: [],
    });
    const mensajesRecibidos = await getCollection(
      'mensajes',
      [
        {
          field: 'receptor',
          operator: 'array-contains',
          id: this.state.usuarioId,
        },
        { field: 'idMateria', operator: '==', id: this.state.materiaId },
        { field: 'general', operator: '==', id: false },
        { field: 'formal', operator: '==', id: false },
      ],
      [{ order: 'fecha_creacion', orderCond: 'asc' }]
    );
    this.dataMessageReceivedRenderer(mensajesRecibidos);

    const mensajesGeneralesRecibidos_1 = await getCollection(
      'mensajes',
      [
        { field: 'emisor.id', operator: '<', id: this.state.usuarioId },
        { field: 'idMateria', operator: '==', id: this.state.materiaId },
        { field: 'general', operator: '==', id: true },
        { field: 'formal', operator: '==', id: false },
      ],
      [
        { order: 'emisor.id', orderCond: 'asc' },
        { order: 'fecha_creacion', orderCond: 'asc' },
      ]
    );
    this.dataMessageReceivedRenderer(mensajesGeneralesRecibidos_1);

    const mensajesGeneralesRecibidos_2 = await getCollection(
      'mensajes',
      [
        { field: 'emisor.id', operator: '>', id: this.state.usuarioId },
        { field: 'idMateria', operator: '==', id: this.state.materiaId },
        { field: 'general', operator: '==', id: true },
        { field: 'formal', operator: '==', id: false },
      ],
      [
        { order: 'emisor.id', orderCond: 'asc' },
        { order: 'fecha_creacion', orderCond: 'asc' },
      ]
    );
    this.dataMessageReceivedRenderer(mensajesGeneralesRecibidos_2);

    const mensajesEnviados = await getCollection(
      'mensajes',
      [
        { field: 'emisor.id', operator: '==', id: this.state.usuarioId },
        { field: 'idMateria', operator: '==', id: this.state.materiaId },
        { field: 'formal', operator: '==', id: false },
      ],
      [{ order: 'fecha_creacion', orderCond: 'asc' }]
    );
    await this.dataMessageSentRenderer(mensajesEnviados);

    await this.orderMessages();
  };

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
      contenidoMensaje: desencriptarTexto(rowInfo.original.contenido),
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
      selectedOptions: [],
    });
  };

  handleChangeMulti = (selectedOptions) => {
    this.setState({ selectedOptions });
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
      responde_a: this.state.idMensajeAResponder
        ? this.state.idMensajeAResponder
        : '',
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

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
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
      datosUsuarios,
      selectedOptions,
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
              datosUsuarios={datosUsuarios}
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
              modalFooterClassname="modal-footer-mensajeria"
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
              <Row>
                <Colxx xxs="12" md="12">
                  <label>Mensaje a reenviar</label>
                  <Input
                    defaultValue={contenidoMensaje}
                    onChange={this.handleChange}
                    className="resend-message"
                    type="textarea"
                    autocomplete="off"
                  />
                  <label>Destinatarios</label>
                  <Select
                    className="react-select"
                    classNamePrefix="react-select"
                    isMulti
                    placeholder="Seleccione los destinatarios"
                    name="form-field-name"
                    value={selectedOptions}
                    onChange={this.handleChangeMulti}
                    options={datosUsuarios}
                    required
                  />
                </Colxx>
              </Row>
              <ModalFooter>
                <Button
                  color="primary"
                  disabled={selectedOptions.length === 0}
                  onClick={this.handleSubmit}
                >
                  Enviar
                </Button>
                <Button color="secondary" onClick={this.toggleReenviarModal}>
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalChico>
          )}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser, seleccionCurso }) => {
  const { user, userData } = authUser;
  const { nombre, apellido } = userData;
  const { subject } = seleccionCurso;
  return { user, subject, nombre, apellido };
};

export default connect(mapStateToProps)(Mensajeria);
