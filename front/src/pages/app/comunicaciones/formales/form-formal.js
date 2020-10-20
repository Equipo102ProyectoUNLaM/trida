import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ModalFooter, Button, FormGroup, Label, Row } from 'reactstrap';
import Select from 'react-select';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { addDocument } from 'helpers/Firebase-db';
import { Formik, Form, Field } from 'formik';
import { mensajesSchema } from './validations';
import { encriptarTexto } from 'handlers/EncryptionHandler';
import { rolesSelect } from 'constants/rolesData';
import { getUsuariosPorMateriaConRol } from 'helpers/Firebase-user';

class FormMensaje extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textoMensaje: '',
      asunto: '',
      selectedOptions: [],
      rolesReceptores: [],
      selectedOptionsNames: [],
      isLoading: true,
      idUser: this.props.user,
      opcionesDelSelect: rolesSelect,
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  handleChangeMulti = (selectedOptions) => {
    this.setState({ selectedOptions });
    const rolesReceptores = selectedOptions.map((opt) => opt.label);
    this.setState({ rolesReceptores });
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

  disableEnviarButton() {
    return this.state.selectedOptions.length === 0;
  }

  getUsuariosReceptores = async () => {
    const roles = this.state.selectedOptions.map((elem) => elem.key);
    const usuariosConData = await getUsuariosPorMateriaConRol(
      this.props.subject.id
    );
    const receptoresPromise = usuariosConData.reduce(
      (result, { id, rol }) =>
        roles.includes(rol) ? result.concat(id) : result,
      []
    );
    const receptores = await Promise.all(receptoresPromise);
    return receptores;
  };

  handleSubmit = async (values) => {
    let receptores = await this.getUsuariosReceptores();

    const msg = {
      emisor: {
        id: this.state.idUser,
        nombre: this.props.nombre + ' ' + this.props.apellido,
      },
      receptor: receptores,
      rolesReceptores: this.state.rolesReceptores,
      contenido: encriptarTexto(values.textoMensaje),
      asunto: values.asunto,
      idMateria: this.props.subject.id,
    };

    //guardar msj en bd
    await addDocument(
      'formales',
      msg,
      this.props.user,
      'Comunicación enviada',
      'Comunicación enviada exitosamente',
      'Error al enviar la comunicación'
    );

    this.props.onMensajeEnviado();
  };

  render() {
    const {
      isLoading,
      selectedOptions,
      asunto,
      textoMensaje,
      opcionesDelSelect,
    } = this.state;

    const { toggleModal } = this.props;

    return isLoading ? (
      <div className="loading" />
    ) : (
      <Formik
        initialValues={{
          textoMensaje,
          asunto,
          opcionesDelSelect,
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
                <Row>
                  <Colxx xxs="12" md="4">
                    <Select
                      className="react-select"
                      classNamePrefix="react-select"
                      isMulti
                      placeholder="Seleccioná los destinatarios"
                      name="select_usuarios"
                      value={selectedOptions}
                      onChange={this.handleChangeMulti}
                      options={opcionesDelSelect}
                      required
                    />
                  </Colxx>
                </Row>
              </Colxx>
            </Row>

            <FormGroup className="mb-3 asunto-msj ">
              <Label>Asunto</Label>
              <Field name="asunto" className="form-control" />
              {errors.asunto && touched.asunto ? (
                <div className="invalid-feedback d-block">{errors.asunto}</div>
              ) : null}
            </FormGroup>

            <FormGroup className="mb-3">
              <Label>Mensaje</Label>
              <Field
                autocomplete="off"
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
                disabled={this.disableEnviarButton()}
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
