import React, { Component } from 'react';
import { Row, Card, CardTitle, Label, Button, FormGroup } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from 'redux/actions';
import { Formik, Form, Field } from 'formik';
import { NotificationManager } from 'components/common/react-notifications';
import { enviarNotificacionError } from 'helpers/Utils-ui';

import IntlMessages from 'helpers/IntlMessages';
import { Colxx } from 'components/common/CustomBootstrap';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isInvited: false,
    };
  }
  onUserRegister = () => {
    const userObj = {
      email: this.state.email,
      password: this.state.password,
      isInvited: this.state.isInvited,
    };
    if (!this.props.loading) {
      if (this.state.email !== '' && this.state.password !== '') {
        this.props.registerUser(userObj, this.props.history);
      } else {
        enviarNotificacionError('Complete el nombre y apellido', 'Error');
      }
    }
  };

  componentDidUpdate() {
    if (this.props.error) {
      enviarNotificacionError('Error en el registro', 'Error');
    }
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h2">třída</p>
              <p className="white mb-0">
                Use este formulario para registrarse. <br />
                Si ya está registrado, por favor{' '}
                <NavLink to={`/user/login`} className="btn-link">
                  ingrese
                </NavLink>
                .
              </p>
            </div>
            <div className="form-side">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.register" />
              </CardTitle>
              <Formik onSubmit={this.onUserRegister}>
                {({ errors, touched }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.email" />
                      </Label>
                      <Field
                        className="form-control"
                        name="email"
                        validate={this.validateEmail}
                        onChange={this.handleChange}
                      />
                      {errors.email && touched.email && (
                        <div className="invalid-feedback d-block">
                          {errors.email}
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.password" />
                      </Label>
                      <Field
                        className="form-control"
                        type="password"
                        name="password"
                        onChange={this.handleChange}
                        validate={this.validatePassword}
                      />
                      {errors.password && touched.password && (
                        <div className="invalid-feedback d-block">
                          {errors.password}
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
