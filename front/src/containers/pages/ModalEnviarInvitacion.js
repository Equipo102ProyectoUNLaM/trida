import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from 'reactstrap';
import TagsInput from 'react-tagsinput';
import IntlMessages from 'helpers/IntlMessages';
import { enviarNotificacionExitosa } from 'helpers/Utils-ui';
import { registerUser } from 'redux/actions';
import { connect } from 'react-redux';
import 'react-tagsinput/react-tagsinput.css';
import { getDocument } from 'helpers/Firebase-db';

class ModalEnviarInvitacion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalInvitacionOpen: false,
      tags: [],
      userId: localStorage.getItem('user_id'),
      items: [],
      isLoading: true,
      isEmpty: false,
    };
  }

  componentDidMount() {
    this.getInstitucionesDeUsuario(this.state.userId);
  }

  getInstitucionesDeUsuario = async (userId) => {
    const array = [];
    try {
      const userRef = await getDocument(`usuarios/${userId}`);
      const { data } = userRef;
      const { instituciones } = data;
      if (!instituciones) return;
      for (const inst of instituciones) {
        const institutionRef = await getDocument(`${inst.institucion_id.path}`);
        const { data } = institutionRef;
        const { nombre, niveles } = data;
        const obj = {
          id: inst.institucion_id.id,
          name: nombre,
          tags: niveles,
        };
        array.push(obj);
      }
    } catch (err) {
      console.log('Error getting documents', err);
    } finally {
      this.dataListRenderer(array);
    }
  };

  dataListRenderer(array) {
    this.setState({
      items: array,
      isLoading: false,
      isEmpty: array.length === 0 ? true : false,
    });
  }

  onConfirm = async () => {
    const userObj = {
      email: this.state.tags[0],
      password: '123456',
      isInvited: true,
    };
    //agarrar los mails de los tags, autogenerar contraseña para cada uno
    // crear usuarios con todo vacío menos el curso del cual se lo esta invitando y mandar mail de invitación
    try {
      await this.props.registerUser(userObj, this.props.history);
    } catch (error) {
      console.log(error);
    } finally {
      this.registroExitoso();
    }
  };

  registroExitoso = async () => {
    this.props.toggle();
    enviarNotificacionExitosa(
      'Invitación enviada exitosamente',
      'Invitación enviada!'
    );
  };

  handleTagChange = (tags) => {
    this.setState({ tags });
  };

  render() {
    const { isOpen, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Enviar Invitación</ModalHeader>
        <ModalBody>
          <p className="tip-text">
            Ingresá el email del usuario al que querés invitar. <br /> Presioná
            &quot;Enter&quot; por cada mail que ingreses.
          </p>
          <Form>
            <div className="form-group has-float-label">
              <TagsInput
                value={this.state.tags}
                onChange={this.handleTagChange}
                inputProps={{
                  placeholder: '',
                }}
              />
              <IntlMessages id="user.mail-invitado" />
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" size="sm" onClick={this.onConfirm}>
            Confirmar
          </Button>
          <Button color="secondary" size="sm" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(null, {
  registerUser,
})(ModalEnviarInvitacion);
