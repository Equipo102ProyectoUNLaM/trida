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
import 'react-tagsinput/react-tagsinput.css';

class ModalEnviarInvitacion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalInvitacionOpen: false,
      tags: [],
    };
  }

  onConfirm = () => {
    //agarrar los mails de los tags, autogenerar contraseña para cada uno
    // crear usuarios con todo vacío menos el curso del cual se lo esta invitando y mandar mail de invitación
    //this.props.registerUser(values, this.props.history);
    console.log(this.state.tags);
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

export default connect(mapStateToProps, {
  registerUser,
})(ModalEnviarInvitacion);
