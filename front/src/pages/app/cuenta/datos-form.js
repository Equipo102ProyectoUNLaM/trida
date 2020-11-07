import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Button,
  Label,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { injectIntl } from 'react-intl';
import IntlMessages from 'helpers/IntlMessages';
import { Formik, Form, Field } from 'formik';
import { enviarNotificacionError } from 'helpers/Utils-ui';
import { editDocument } from 'helpers/Firebase-db';
import { updateDatosUsuario } from 'redux/actions';
import { getUserData } from 'helpers/Firebase-user';
import { storage, auth, functions } from 'helpers/Firebase';
import { newEmailMail, oldEmailMail } from 'constants/emailTexts';

import { datosSchema } from './validations';
const publicUrl = process.env.PUBLIC_URL;
const imagenDefaultUsuario = `${publicUrl}/assets/img/defaultUser.png`;

class DatosForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: '',
      apellido: '',
      originalMail: '',
      mail: '',
      telefono: '',
      foto: '',
      fotoPerfilText: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getDatosDeUsuario();
  }

  getDatosDeUsuario = async () => {
    const data = await getUserData(this.props.user);

    this.setState({
      nombre: data.nombre,
      apellido: data.apellido,
      originalMail: data.mail,
      mail: data.mail,
      telefono: data.telefono,
      isLoading: false,
    });
  };

  setSelectedFile = (event) => {
    this.setState({
      foto: event.target.files[0],
      fotoPerfilText: event.target.files[0].name,
    });
  };

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  subirFoto = async (file) => {
    const listRef = storage.ref(`usuarios/${this.props.user}`);
    const task = listRef.put(file);
    this.setState({
      isLoading: true,
    });

    task.on(
      'state_changed',
      () => {},
      (error) => {
        console.error(error.message);
        enviarNotificacionError(
          'La foto de perfil no pudo ser cargada',
          'Error'
        );
        this.setState({
          isLoading: false,
        });
      },
      () => {
        this.setState({
          isLoading: false,
        });
      }
    );
  };

  sendEmailChangeEmail = async (email, options) => {
    const sendMail = functions.httpsCallable('sendMail');
    sendMail({ email, ...options }).catch(function (error) {
      console.log(error);
    });
  };

  onSubmit = async (values) => {
    const { foto, originalMail } = this.state;
    const { nombre, apellido, mail, telefono } = values;
    var user = auth.currentUser;

    const obj = {
      nombre,
      apellido,
      telefono,
    };

    if (foto) {
      await this.subirFoto(foto);
    }

    await editDocument(
      'usuarios',
      this.props.user,
      obj,
      'Información actualizada'
    );

    if (mail !== originalMail) {
      user.updateEmail(mail);
      await this.sendEmailChangeEmail(mail, newEmailMail);
      await this.sendEmailChangeEmail(originalMail, oldEmailMail);
      await editDocument('usuarios', this.props.user, { mail });
    }

    const userData = await getUserData(this.props.user);
    this.props.updateDatosUsuario(userData);
  };

  render() {
    const { isLoading, nombre, apellido, mail, telefono } = this.state;
    let { foto } = this.props;
    foto = foto ? foto : imagenDefaultUsuario;
    const initialValues = { nombre, apellido, mail, telefono };

    return isLoading ? (
      <div className="cover-spin" />
    ) : (
      <>
        <Row className="h-100">
          <Colxx>
            <Formik
              initialValues={initialValues}
              onSubmit={this.onSubmit}
              validationSchema={datosSchema}
            >
              {({ errors, touched }) => (
                <Form className="av-tooltip tooltip-label-bottom">
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="user.nombre" />
                    </Label>
                    <Field
                      className="form-control"
                      name="nombre"
                      autoComplete="off"
                    />
                    {errors.nombre && touched.nombre && (
                      <div className="invalid-feedback d-block">
                        {errors.nombre}
                      </div>
                    )}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="user.apellido" />
                    </Label>
                    <Field
                      className="form-control"
                      name="apellido"
                      autoComplete="off"
                    />
                    {errors.apellido && touched.apellido && (
                      <div className="invalid-feedback d-block">
                        {errors.apellido}
                      </div>
                    )}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="user.email" />
                    </Label>
                    <Field
                      autoComplete="off"
                      className="form-control"
                      name="mail"
                    />
                    {errors.mail && touched.mail && (
                      <div className="invalid-feedback d-block">
                        {errors.mail}
                      </div>
                    )}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="user.telefono" />
                    </Label>
                    <Field
                      autoComplete="off"
                      className="form-control"
                      name="telefono"
                    />
                    {errors.telefono && touched.telefono && (
                      <div className="invalid-feedback d-block">
                        El teléfono debe ser un número
                      </div>
                    )}
                  </FormGroup>
                  <div className="form-group has-float-label div-foto">
                    <Label>
                      <IntlMessages id="user.foto" />
                    </Label>
                    <img
                      src={foto}
                      alt="foto-default-usuario"
                      className="social-header card-img wh-200 mb-2 padding-1 border-radius-50"
                    />
                    <InputGroup className="input-group-foto">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>Cambiar foto</InputGroupText>
                      </InputGroupAddon>
                      <div className="input-file-foto">
                        <label
                          className="w-100 h-100 label-foto"
                          htmlFor="upload-photo"
                        >
                          {this.state.fotoPerfilText}
                        </label>
                        <input
                          onChange={this.setSelectedFile}
                          type="file"
                          name="foto"
                          id="upload-photo"
                        />
                      </div>
                    </InputGroup>
                  </div>
                  <Row className="button-group mr-0">
                    <Button
                      onClick={this.onDataSubmit}
                      color="primary"
                      className={`btn-shadow btn-multiple-state ${
                        this.props.loading ? 'show-spinner' : ''
                      }`}
                      size="lg"
                    >
                      <span className="spinner d-inline-block">
                        <span className="bounce1" />
                        <span className="bounce2" />
                        <span className="bounce3" />
                      </span>
                      <span className="label">
                        <IntlMessages id="cuenta.guardar-datos" />
                      </span>
                    </Button>
                  </Row>
                </Form>
              )}
            </Formik>
          </Colxx>
        </Row>
      </>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, userData } = authUser;
  const { foto } = userData;
  return {
    user,
    foto,
  };
};

export default injectIntl(
  connect(mapStateToProps, { updateDatosUsuario })(DatosForm)
);
