import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, ModalFooter, Button, FormGroup, Label, Row } from 'reactstrap';
import Select from 'react-select';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { addDocument } from 'helpers/Firebase-db';
import ROLES from 'constants/roles';
import { Formik, Form, Field } from 'formik';
import { mensajesSchema } from './validations';

class FormMensaje extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textoMensaje: '',
      asunto: this.props.esResponder
        ? 'RE: ' + this.props.asuntoAResponder
        : '',
      selectedOptions: [],
      selectedTag: [],
      idMateria: this.props.subject.id,
      isLoading: true,
      idUser: this.props.user,
      esGeneral: false,
      usuariosDelSelect: this.props.datosUsuarios,
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
      usuariosDelSelect: [],
    });
  }

  handleSubmit = async (values) => {
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
      contenido: values.textoMensaje,
      asunto: values.asunto,
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
      usuariosDelSelect,
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
      <Formik
        initialValues={{
          textoMensaje: textoMensaje,
          esGeneral: esGeneral,
          asunto: asunto,
          usuariosDelSelect: usuariosDelSelect,
          usuarioAResponder: usuarioAResponder,
          mensajeAResponder: mensajeAResponder,
        }}
        onSubmit={this.handleSubmit}
        validationSchema={mensajesSchema}
      >
        {({ errors, touched }) => (
          <Form className="av-tooltip tooltip-label-right" autoComplete="off">
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
                        name="select_usuarios"
                        value={selectedOptions}
                        onChange={this.handleChangeMulti}
                        options={usuariosDelSelect}
                        required
                        isDisabled={esGeneral}
                      />
                    </Colxx>
                    {rol === ROLES.Docente && (
                      <Colxx xxs="12" md="6" className="receivers-general">
                        <Field
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
                    <Field
                      value={usuarioAResponder}
                      name="usuarioAResponder"
                      disabled
                      className="form-control"
                    ></Field>
                    <label className="answer-message-title">
                      Mensaje a responder
                    </label>
                    <Field
                      value={mensajeAResponder}
                      name="mensajeAResponder"
                      disabled
                      className="form-control"
                    ></Field>
                  </Row>
                )}
              </Colxx>
            </Row>

            <FormGroup className="mb-3 asunto-msj ">
              <Label>Asunto</Label>
              <Field name="asunto" className="form-control" />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label>Mensaje</Label>
              <Field
                name="textoMensaje"
                component="textarea"
                className="form-control"
              />
              {errors.textoMensaje && touched.textoMensaje ? (
                <div className="invalid-feedback d-block">
                  {errors.textoMensaje}
                </div>
              ) : null}
            </FormGroup>

            <ModalFooter>
              <Button
                color="primary"
                type="submit"
                disabled={/* selectedOptions.length === 0 */ false}
              >
                Enviar
              </Button>
              <Button color="secondary" onClick={toggleModal}>
                Cancelar
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
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
