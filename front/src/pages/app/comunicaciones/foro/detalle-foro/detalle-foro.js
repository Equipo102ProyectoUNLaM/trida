import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import EncabezadoForo from './encabezado-foro';
import DetalleMensaje from './detalle-mensaje';
import InputMensajeForo from './input-mensaje-foro';
import { injectIntl } from 'react-intl';
import {
  getDocumentWithSubCollection,
  addToSubCollection,
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
  }

  getTemaForo = async () => {
    if (!this.props.match.params.foroId) {
      this.setState({ isLoading: false });
      this.props.history.push(`/app/foros`);
    }
    const { foroId } = this.props.match.params;

    const temaForo = await getDocumentWithSubCollection(
      `foros/${foroId}`,
      'mensajes'
    );
    console.log(temaForo);

    const { id, data, subCollection } = temaForo;
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
      nombre: nombre,
      descripcion: descripcion,
      fecha_creacion: fecha_creacion,
      idForo: foroId,
      mensajes: subCollection,
      loading: false,
    });
  };

  componentDidUpdate() {
    if (this.state.loading) {
      this.getTemaForo();
    }

    if (this._scrollBarRef) {
      this._scrollBarRef._ps.element.scrollTop = this._scrollBarRef._ps.contentHeight;
    }
  }

  handleChatInputPress = (e) => {
    if (e.key === 'Enter') {
      if (this.state.messageInput.length > 0) {
        this.addMessageToForum(
          this.state.idForo,
          this.props.id,
          this.state.messageInput,
          this.props.nombre,
          this.props.apellido
        );
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
      this.addMessageToForum(
        this.state.idForo,
        this.props.id,
        this.state.messageInput,
        this.props.nombre,
        this.props.apellido
      );
      this.setState({
        messageInput: '',
      });
    }
  };

  addMessageToForum = async (idForo, idUsuario, mensaje, nombre, apellido) => {
    this.setState({
      isLoading: true,
    });
    const obj = {
      idCreador: idUsuario,
      nombreCreador: nombre + ' ' + apellido,
      contenido: mensaje,
    };
    await addToSubCollection(
      'foros',
      idForo,
      'mensajes',
      obj,
      idUsuario,
      'Mensaje enviado!',
      'Mensaje enviado exitosamente',
      'Error al enviar el mensaje'
    );
    this.setState({
      isLoading: false,
    });
  };

  render() {
    const { nombre, apellido, id } = this.props;
    const { mensajes, titulo, descripcion, loading, messageInput } = this.state;

    return !loading ? (
      <Fragment>
        <Row>
          <Colxx xxs="12" className="chat-app">
            <EncabezadoForo nombre={titulo} descripcionForo={descripcion} />
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
                  />
                );
              })}
            </PerfectScrollbar>
            <InputMensajeForo
              messageInput={messageInput}
              handleChatInputPress={this.handleChatInputPress}
              handleChatInputChange={this.handleChatInputChange}
              handleSendButtonClick={this.handleSendButtonClick}
            />
          </Colxx>
        </Row>
      </Fragment>
    ) : (
      <div className="loading" />
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { userData } = authUser;
  const { rol, nombre, apellido, id } = userData;

  return { rol, nombre, apellido, id };
};

export default injectIntl(connect(mapStateToProps)(DetalleForo));
