import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { withRouter } from 'react-router-dom';

import {
  getConversations,
  changeConversation,
  addMessageToConversation,
} from '../../../redux/actions';
import EncabezadoForo from './encabezado-foro';
import DetalleMensaje from './detalle-mensaje';
import InputMensajeForo from './input-mensaje-foro';

class DetalleForo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageInput: '',
      mensajes: this.props.mensajes,
      idForo: this.props.id,
      titulo: this.props.nombre,
      descripcion: this.props.descripcion,
      loading: true,
    };
  }

  componentDidMount() {
    const currentUserId = 0;
    this.props.getConversations(currentUserId);
  }

  componentDidUpdate() {
    if (
      this.props.chatApp.loadingConversations &&
      this.state.loading &&
      this.props.chatApp.selectedUser == null
    ) {
      this.props.changeConversation(this.props.chatApp.selectedUserId);
    }

    if (this._scrollBarRef) {
      this._scrollBarRef._ps.element.scrollTop = this._scrollBarRef._ps.contentHeight;
    }
  }

  handleChatInputPress = (e) => {
    if (e.key === 'Enter') {
      if (this.state.messageInput.length > 0) {
        this.props.addMessageToConversation(
          this.props.chatApp.currentUser.id,
          this.props.chatApp.selectedUser.id,
          this.state.messageInput,
          this.props.chatApp.conversations
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
      this.props.addMessageToConversation(
        this.state.idForo,
        this.props.id,
        this.state.messageInput,
        this.props.nombre + ' ' + this.props.apellido
      );
      this.setState({
        messageInput: '',
      });
    }
  };

  render() {
    const {
      allContacts,
      conversations,
      loadingConversations,
      loadingContacts,
      currentUser,
      selectedUser,
    } = this.props.chatApp;

    const { nombre, apellido, id } = this.props;

    const { mensajes, titulo, descripcion, loading, messageInput } = this.state;

    const selectedConversation =
      loadingConversations && loadingContacts && selectedUser
        ? conversations.find(
            (x) =>
              x.users.includes(currentUser.id) &&
              x.users.includes(selectedUser.id)
          )
        : null;
    return !loading ? (
      <Fragment>
        <Row className="app-row">
          <Colxx xxs="12" className="chat-app">
            {loadingConversations && selectedUser && (
              <EncabezadoForo
                nombre={titulo}
                thumb={selectedUser.thumb}
                descripcionForo={descripcion}
              />
            )}

            {selectedConversation && (
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
            )}
          </Colxx>
        </Row>
        <InputMensajeForo
          placeholder="forums.send"
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
  const { rol, nombre, apellido, id } = userData;

  return { rol, nombre, apellido, id };
};

export default connect(mapStateToProps)(withRouter(DetalleForo));
