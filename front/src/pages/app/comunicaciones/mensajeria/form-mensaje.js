import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, ModalFooter, Button, FormGroup, Label, Row } from 'reactstrap';
import Select from 'react-select';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { addDocument } from 'helpers/Firebase-db';
import ROLES from 'constants/roles';

class FormMensaje extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textoMensaje: '',
      asunto: '',
      selectedOptions: [],
      selectedTag: [],
      idMateria: this.props.subject.id,
      isLoading: true,
      idUser: this.props.user,
      esGeneral: false,
      datos: this.props.datosUsuarios,
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  handleChangeMulti = (selectedOptions) => {
    this.setState({ selectedOptions });
  };

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  componentWillUnmount() {
    this.setState({
      datos: [],
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    //Si no es un mensaje general, convierto el array de seleccionados al formato { id, nombre }
    let receptores = null;
    if (!this.state.esGeneral) {
      receptores = this.state.selectedOptions.map(({ value }) => value);
    }

    if (this.props.esResponder) {
      receptores = [this.props.idUsuarioAResponder];
    }

    const msg = {
      emisor: {
        id: this.state.idUser,
        nombre: this.props.nombre + ' ' + this.props.apellido,
      },
      receptor: receptores,
      contenido: this.state.textoMensaje,
      asunto: this.state.asunto,
      formal: false,
      general: this.state.esGeneral,
      idMateria: this.state.idMateria,
      responde_a: this.props.idMensajeAResponder
        ? this.props.idMensajeAResponder
        : '',
    };
    //guardar msj en bd
    await addDocument(
      'mensajes',
      msg,
      this.props.user,
      'Mensaje enviado',
      'Mensaje enviado exitosamente',
      'Error al enviar el mensaje'
    );

    this.props.onMensajeEnviado();
  };

  handleCheckBoxChange = async () => {
    this.setState({
      esGeneral: !this.state.esGeneral,
      selectedOptions: [],
    });
  };

  render() {
    const {
      isLoading,
      selectedOptions,
      asunto,
      textoMensaje,
      esGeneral,
      datos,
    } = this.state;
    const {
      toggleModal,
      rol,
      mensajeAResponder,
      usuarioAResponder,
      esResponder,
    } = this.props;

    return isLoading ? (
      <div className="loading" />
    ) : (
      <form onSubmit={this.handleSubmit}>
        <Row>
          <Colxx xxs="12" md="12">
            <label>
              <IntlMessages id="messages.receiver" />
            </label>
            {!esResponder && (
              <Row>
                <Colxx xxs="12" md="4">
                  <Select
                    className="react-select"
                    classNamePrefix="react-select"
                    isMulti
                    placeholder="Seleccione los destinatarios"
                    name="form-field-name"
                    value={selectedOptions}
                    onChange={this.handleChangeMulti}
                    options={datos}
                    required
                    isDisabled={esGeneral}
                  />
                </Colxx>
                {rol === ROLES.Docente && (
                  <Colxx xxs="12" md="6" className="receivers-general">
                    <Input
                      name="esGeneral"
                      className="general-check"
                      type="checkbox"
                      checked={esGeneral}
                      onChange={() => this.handleCheckBoxChange()}
                    />
                    <label>¿Es un mensaje general?</label>
                  </Colxx>
                )}
              </Row>
            )}
            {esResponder && (
              <Row>
                <Input
                  value={usuarioAResponder}
                  disabled
                  className="answer-message"
                ></Input>
                <label className="answer-message-title">
                  Mensaje a responder
                </label>
                <Input
                  value={mensajeAResponder}
                  disabled
                  className="answer-message"
                ></Input>
              </Row>
            )}
          </Colxx>
        </Row>

        <FormGroup className="mb-3 asunto-msj ">
          <Label>Asunto</Label>
          <Input name="asunto" onChange={this.handleChange} value={asunto} />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label>Mensaje</Label>
          <Input
            name="textoMensaje"
            type="textarea"
            onChange={this.handleChange}
            value={textoMensaje}
          />
        </FormGroup>

        <ModalFooter>
          <Button color="primary" type="submit">
            Enviar
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </form>
    );
  }
}

const mapStateToProps = ({ authUser, seleccionCurso }) => {
  const { user, userData } = authUser;
  const { nombre, apellido, rol } = userData;
  const { subject } = seleccionCurso;
  return { user, subject, nombre, apellido, rol };
};

export default connect(mapStateToProps)(FormMensaje);
