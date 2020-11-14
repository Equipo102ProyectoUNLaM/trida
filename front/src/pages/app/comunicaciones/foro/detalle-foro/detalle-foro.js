import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import EncabezadoForo from './encabezado-foro';
import DetalleMensaje from './detalle-mensaje';
import InputMensajeForo from './input-mensaje-foro';
import { injectIntl } from 'react-intl';
import ROLES from 'constants/roles';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import {
  getDocumentWithSubCollection,
  addToSubCollection,
  deleteDocument,
  getCollectionOnSnapshot,
} from 'helpers/Firebase-db';

class DetalleForo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageInput: '',
      mensajes: [],
      idForo: this.props.location.id,
      titulo: '',
      descripcion: '',
      loading: true,
      modalDeleteOpen: false,
      mensajeABorrar: '',
    };
  }

  async componentDidMount() {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.getTemaForo();
      }
    );

    document.body.classList.add('no-footer');
  }

  componentWillUnmount() {
    document.body.classList.remove('no-footer');
  }

  getTemaForo = async () => {
    if (!this.props.match.params.foroId) {
      this.setState({ isLoading: false });
      this.props.history.push(`/app/comunicaciones/foro/`);
    }
    const { foroId } = this.props.match.params;

    const temaForo = await getDocumentWithSubCollection(
      `foros/${foroId}`,
      'mensajes',
      [{ order: 'fecha_creacion', orderCond: 'asc' }]
    );

    const { data, subCollection } = temaForo;
    const {
      nombre,
      fecha_creacion,
      descripcion,
      creador,
      nombreCreador,
    } = data;

    this.setState({
      creador: creador,
      nombreCreador: nombreCreador,
      titulo: nombre,
      descripcion: descripcion,
      fecha_creacion: fecha_creacion,
      idForo: foroId,
      mensajes: subCollection,
      loading: false,
    });
  };

  componentDidUpdate(_, prevState) {
    if (this.state.loading && !prevState.loading) {
      this.getTemaForo();
    }

    if (this.state.idForo && !prevState.idForo) {
      getCollectionOnSnapshot(
        `foros/${this.state.idForo}/mensajes`,
        this.setNewMessages,
        [{ order: 'fecha_creacion', orderCond: 'asc' }]
      );
    }
  }

  setNewMessages = (mensajes) => {
    let nuevosMensajes = [];
    mensajes.forEach((mensaje) => {
      nuevosMensajes.push({
        id: mensaje.id,
        data: mensaje.data(),
      });
    });

    this.setState(
      {
        mensajes: nuevosMensajes,
      },
      () => {
        if (this._scrollBarRef) {
          this._scrollBarRef._ps.element.scrollTop = this._scrollBarRef._ps.contentHeight;
        }
      }
    );
  };

  handleChatInputPress = (e) => {
    if (e.key === 'Enter') {
      if (this.state.messageInput.length > 0) {
        this.addMessageToForum(this.state.idForo, this.state.messageInput);
        this.setState({
          messageInput: '',
        });
      }
    }
  };

  handleChatInputChange = (e) => {
    this.setState({
      messageInput: e.target.value,
    });
  };

  handleSendButtonClick = () => {
    if (this.state.messageInput.length > 0) {
      this.addMessageToForum(this.state.idForo, this.state.messageInput);
      this.setState({
        messageInput: '',
      });
    }
  };

  addMessageToForum = async (idForo, mensaje) => {
    this.setState({
      isLoading: true,
    });
    const obj = {
      idCreador: this.props.id,
      nombreCreador: this.props.nombre + ' ' + this.props.apellido,
      contenido: mensaje,
      fotoCreador: this.props.foto,
    };
    await addToSubCollection(
      'foros',
      idForo,
      'mensajes',
      obj,
      this.props.id,
      'Mensaje enviado!',
      'Mensaje enviado exitosamente',
      'Error al enviar el mensaje'
    );
    this.setState({
      isLoading: false,
    });

    this.getTemaForo();
  };

  removeMessageToForum = async () => {
    this.setState({
      isLoading: true,
    });
    await deleteDocument(
      `foros/${this.state.idForo}/mensajes`,
      this.state.mensajeABorrar,
      'Mensaje'
    );
    this.setState({
      isLoading: false,
      modalDeleteOpen: !this.state.modalDeleteOpen,
    });

    this.getTemaForo();
  };

  goToForos = () => {
    this.props.history.push(`/app/comunicaciones/foro/`);
  };

  toggleDeleteModal = () => {
    this.setState({
      modalDeleteOpen: !this.state.modalDeleteOpen,
    });
  };

  borrarMensaje = (mensaje) => {
    this.setState({
      mensajeABorrar: mensaje,
    });

    this.toggleDeleteModal();
  };

  render() {
    const { id } = this.props;
    const {
      mensajes,
      titulo,
      descripcion,
      loading,
      messageInput,
      modalDeleteOpen,
    } = this.state;
    return !loading ? (
      <Fragment>
        <Row className="">
          <Colxx xxs="12" className="chat-app">
            <EncabezadoForo
              nombre={titulo}
              descripcionForo={descripcion}
              goToForos={this.goToForos}
            />
            <PerfectScrollbar
              ref={(ref) => {
                this._scrollBarRef = ref;
              }}
              containerRef={(ref) => {}}
              options={{ suppressScrollX: true, wheelPropagation: false }}
            >
              {mensajes.map((item, index) => {
                return (
                  <DetalleMensaje
                    key={index}
                    item={item}
                    idUsuarioActual={id}
                    onDelete={
                      this.props.rol !== ROLES.Alumno
                        ? this.borrarMensaje
                        : false
                    }
                  />
                );
              })}
            </PerfectScrollbar>
          </Colxx>
          {modalDeleteOpen && (
            <ModalConfirmacion
              texto="¿Estás seguro de borrar el mensaje?"
              titulo="Borrar Mensaje"
              buttonPrimary="Aceptar"
              buttonSecondary="Cancelar"
              toggle={this.toggleDeleteModal}
              isOpen={modalDeleteOpen}
              onConfirm={this.removeMessageToForum}
            />
          )}
        </Row>
        <InputMensajeForo
          messageInput={messageInput}
          handleChatInputPress={this.handleChatInputPress}
          handleChatInputChange={this.handleChatInputChange}
          handleSendButtonClick={this.handleSendButtonClick}
        />
      </Fragment>
    ) : (
      <div className="loading" />
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { userData } = authUser;
  const { rol, nombre, apellido, id, foto } = userData;

  return { rol, nombre, apellido, id, foto };
};

export default injectIntl(connect(mapStateToProps)(DetalleForo));
