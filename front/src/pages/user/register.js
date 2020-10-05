import React, { Component } from 'react';
import { Row, Card, CardTitle, Label, Button, FormGroup } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser, changeLocale } from 'redux/actions';
import { Formik, Form, Field } from 'formik';
import {
  enviarNotificacionError,
  enviarNotificacionExitosa,
} from 'helpers/Utils-ui';
import { FormikReactSelect } from 'containers/form-validations/FormikFields';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx } from 'components/common/CustomBootstrap';
import ROLES_REGISTRO from 'constants/rolesRegistro';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isInvited: false,
    };
  }
  onUserRegister = (values) => {
    const userObj = {
      email: values.email,
      password: values.password,
      isInvited: this.state.isInvited,
      rol: values.rol ? values.rol.value : '',
    };
    if (!this.props.loading) {
      if (values.email !== '' && values.password !== '' && values.rol) {
        this.props.registerUser(userObj, this.props.history);
      } else {
        enviarNotificacionError('Completá email, contraseña y rol', 'Error');
      }
    }
  };

  validateEmail = (value) => {
    let error;
    if (!value) {
      error = 'Por favor, ingresá tu mail';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Dirección de mail inválida';
    }
    return error;
  };

  validatePassword = (value) => {
    let error;
    if (!value) {
      error = 'Por favor, ingresá tu contraseña';
    } else if (value.length < 4) {
      error = 'El password debe ser mayor a 3 caracteres';
    }
    return error;
  };

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      enviarNotificacionExitosa(
        'Usuario registrado con éxito',
        'Registro exitoso'
      );
      this.props.history.push('/user/login');
    }

    if (this.props.error) {
      enviarNotificacionError('Error en el registro', 'Error');
    }
  }

  render() {
    const { password, email } = this.state;
    const initialValues = { email, password };
    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <span className="logo-single" />
              <p className="white mb-0">
                Usá este formulario para registrarte. <br />
                Una vez registrado, podés crear tus instituciones. <br />
                Si ya estás registrado, por favor{' '}
                <NavLink to={`/user/login`} className="btn-link-inverse">
                  ingresá acá
                </NavLink>
                .
              </p>
            </div>
            <div className="form-side">
              <CardTitle className="mb-4">
                <IntlMessages id="user.register" />
              </CardTitle>
              <Formik
                initialValues={initialValues}
                onSubmit={this.onUserRegister}
              >
                {({
                  setFieldValue,
                  setFieldTouched,
                  values,
                  errors,
                  touched,
                }) => (
                  <Form className="av-tooltip tooltip-label-right">
                    <FormGroup className="form-group has-float-label mb-3 error-l-150">
                      <Label>
                        <IntlMessages id="user.email" />
                      </Label>
                      <Field
                        className="form-control"
                        name="email"
                        validate={this.validateEmail}
                      />
                      {errors.email && touched.email && (
                        <div className="invalid-feedback d-block">
                          {errors.email}
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label mb-3 error-l-150">
                      <Label>
                        <IntlMessages id="user.password" />
                      </Label>
                      <Field
                        className="form-control"
                        type="password"
                        name="password"
                        validate={this.validatePassword}
                      />
                      {errors.password && touched.password && (
                        <div className="invalid-feedback d-block">
                          {errors.password}
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label mb-3 error-l-150">
                      <Label>
                        <IntlMessages id="user.rol" />
                      </Label>
                      <FormikReactSelect
                        options={ROLES_REGISTRO}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        value={values.rol}
                        name="rol"
                        placeholder="Seleccioná tu rol"
                      />
                      {errors.rol && touched.rol && (
                        <div className="invalid-feedback d-block">
                          {errors.rol}
                        </div>
                      )}
                    </FormGroup>
                    <Button
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
                        <IntlMessages id="user.register-button" />
                      </span>
                    </Button>
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
  const { user, loading, error } = authUser;
  return { user, loading, error };
};

export default connect(mapStateToProps, {
  registerUser,
})(Register);
