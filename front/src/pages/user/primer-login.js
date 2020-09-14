import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Card,
  CardTitle,
  Label,
  Button,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { enviarNotificacionError } from 'helpers/Utils-ui';
import { editDocument } from 'helpers/Firebase-db';
import { updateDatosUsuario } from 'redux/actions';
import { getUserData } from 'helpers/Firebase-user';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx } from 'components/common/CustomBootstrap';
import { storage } from 'helpers/Firebase';
import { primerLoginSchema } from './validations';

class PrimerLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      telefono: 0,
      isLoading: false,
      fotoPerfilText: 'Seleccione una foto de perfil',
    };
  }

  subirFoto = async (file) => {
    const listRef = storage.ref(`usuarios/${this.props.loginUser}`);
    const task = listRef.put(file);
    this.setState({
      loading: true,
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
          loading: false,
        });
      },
      () => {
        this.setState({
          loading: false,
        });
      }
    );
  };

  onUserSubmit = async (values) => {
    const { nombre, apellido } = values;
    const { telefono, foto } = this.state;

    if (!this.props.loading) {
      if (nombre !== '' && apellido !== '') {
        const obj = {
          nombre,
          apellido,
          telefono,
          primerLogin: false,
        };
        await editDocument(
          'usuarios',
          this.props.loginUser,
          obj,
          'Información'
        );
        this.props.history.push('/seleccion-curso');
      } else {
        enviarNotificacionError('Complete el nombre y apellido', 'Error');
      }
    }
    if (foto) {
      await this.subirFoto(foto);
    }

    const obj = {
      nombre,
      apellido,
      telefono,
      primerLogin: false,
    };
    await editDocument('usuarios', this.props.loginUser, obj, 'Información');
    this.props.history.push('/seleccion-curso');
    const userData = await getUserData(this.props.loginUser);
    this.props.updateDatosUsuario(userData);
  };

  componentDidUpdate() {
    if (this.props.error) {
      enviarNotificacionError('Error en el registro', this.props.error);
    }
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  setSelectedFile = (event) => {
    this.setState({
      foto: event.target.files[0],
      fotoPerfilText: event.target.files[0].name,
    });
  };

  render() {
    const initialValues = { nombre: '', apellido: '' };
    return this.state.isLoading ? (
      <div className="loading" />
    ) : (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="form-side-full">
              <div className="logo-single-theme" />
              <CardTitle className="mb-4">
                <IntlMessages id="user.complete-datos" />
              </CardTitle>
              <Formik
                initialValues={initialValues}
                onSubmit={this.onUserSubmit}
                validationSchema={primerLoginSchema}
              >
                {({ errors, touched }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.nombre" />
                      </Label>
                      <Field className="form-control" name="nombre" />
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
                      <Field className="form-control" name="apellido" />
                      {errors.apellido && touched.apellido && (
                        <div className="invalid-feedback d-block">
                          {errors.apellido}
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.telefono" />
                      </Label>
                      <Field
                        className="form-control"
                        name="telefono"
                        onChange={this.handleChange}
                      />
                      {errors.telefono && touched.telefono && (
                        <div className="invalid-feedback d-block">
                          El teléfono debe ser un número
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup className="form-group">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>Subir foto</InputGroupText>
                        </InputGroupAddon>
                        <div className="input-file">
                          <label htmlFor="upload-photo">
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
                    </FormGroup>
                    <Row className="button-group">
                      <Button
                        type="submit"
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
                          <IntlMessages id="user.enviar-datos" />
                        </span>
                      </Button>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user: loginUser } = authUser;

  return { loginUser };
};

export default connect(mapStateToProps, { updateDatosUsuario })(PrimerLogin);
