import React, { Component } from 'react';
import { Row, Card, CardTitle, Label, FormGroup, Button } from 'reactstrap';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { NotificationManager } from '../../components/common/react-notifications';
import { Formik, Form, Field } from 'formik';

import { loginUser, menuSetClassNames } from 'redux/actions';
import { Colxx } from '../../components/common/CustomBootstrap';
import IntlMessages from '../../helpers/IntlMessages';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  onUserLogin = (values) => {
    if (!this.props.loading) {
      if (values.email !== '' && values.password !== '') {
        this.props.loginUser(values.email, values.password);
        this.props.menuSetClassNames('menu-sub-hidden');
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
      error = 'Por favor, ingresá tu password';
    } else if (value.length < 4) {
      error = 'El password debe ser mayor a 3 caracteres';
    }
    return error;
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.error && this.props.error) {
      NotificationManager.warning(
        this.props.error,
        'Error de Login',
        3000,
        null,
        null,
        ''
      );
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
              <div className="logo-single" />
              {/* <p className="text-white h2">třída</p> */}
              <p className="white mb-0">
                Ingresá tus datos para acceder.
                <br />
                Si sos docente, por favor{' '}
                <NavLink to={`/user/register`} className="btn-link-inverse">
                  registrate acá
                </NavLink>
                .
              </p>
            </div>
            <div className="form-side">
              {/* <div className="logo-single" /> */}
              <CardTitle className="mb-4">
                <IntlMessages id="usuario.login-title" />
              </CardTitle>

              <Formik initialValues={initialValues} onSubmit={this.onUserLogin}>
                {({ errors, touched }) => (
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
                    <div className="d-flex justify-content-between align-items-center">
                      <NavLink to={`/user/forgot-password`}>
                        <IntlMessages id="user.forgot-password-question" />
                      </NavLink>
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
                          <IntlMessages id="user.login-button" />
                        </span>
                      </Button>
                    </div>
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
  //TODO call function to get user data
  const { user, loading, error } = authUser;
  return { user, loading, error };
};

export default connect(mapStateToProps, {
  loginUser,
  menuSetClassNames,
})(withRouter(Login));
