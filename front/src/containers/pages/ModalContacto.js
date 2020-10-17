import React from 'react';
import { connect } from 'react-redux';
import { Button, ModalFooter, Input } from 'reactstrap';
import { functions } from 'helpers/Firebase';
import ModalGrande from 'containers/pages/ModalGrande';
import { enviarNotificacionExitosa } from 'helpers/Utils-ui';

class ModalContacto extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalPlanesOpen: false,
      mensaje: '',
    };
  }

  handleChange = (event) => {
    const mensaje = event.target.value;
    this.setState({ mensaje });
  };

  enviarMensaje = async () => {
    await this.sendContactEmail('trida.app@gmail.com', {
      from: 'Trida App <trida.app@gmail.com>',
      subject: 'Mensaje desde la aplicación',
      html: `<p style="font-size: 16px;">El usuario ${this.props.mail} envió un mensaje a través de la aplicación: <br />
      ${this.state.mensaje}</p>
          <br />
      `,
    });
  };

  sendContactEmail = async (email, options) => {
    const sendMail = functions.httpsCallable('sendMail');

    try {
      await sendMail({ email, ...options });
      enviarNotificacionExitosa(
        'Mensaje enviado exitosamente',
        'Mensaje enviado!'
      );
      this.props.toggle();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { isOpen, toggle } = this.props;
    return (
      <ModalGrande
        modalOpen={isOpen}
        toggleModal={this.toggleModal}
        text="Contacto"
      >
        <span className="tip-text mb-2">
          Enviá tu mensaje al equipo de třída y nos contactaremos a la brevedad.
        </span>
        <Input
          defaultValue=""
          onChange={this.handleChange}
          className="resend-message mt-2"
          type="textarea"
          autoComplete="off"
        />
        <ModalFooter>
          <Button color="primary" size="sm" onClick={this.enviarMensaje}>
            Enviar
          </Button>
          <Button color="secondary" size="sm" onClick={toggle}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalGrande>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { userData } = authUser;
  const { mail } = userData;
  return {
    mail,
  };
};

export default connect(mapStateToProps)(ModalContacto);
