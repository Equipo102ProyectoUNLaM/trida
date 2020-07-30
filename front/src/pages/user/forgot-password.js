import React, { Component } from 'react';
import { Row, Card, CardTitle, Label, FormGroup, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { Colxx } from '../../components/common/CustomBootstrap';
import IntlMessages from '../../helpers/IntlMessages';
import { forgotPassword } from '../../redux/actions';
import { NotificationManager } from '../../components/common/react-notifications';
import { connect } from 'react-redux';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'demo@trida.com.ar',
    };
  }

  onForgotPassword = (values) => {
    if (!this.props.loading) {
      if (values.email !== '') {
        this.props.forgotPassword(values, this.props.history);
      }
    }
  };

  validateEmail = (value) => {
    let error;
    if (!value) {
      error = 'Por favor, ingrese su dirección de mail';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Dirección de email inválida';
    }
    return error;
  };

  componentDidUpdate() {
    if (this.props.error) {
      NotificationManager.warning(
        this.props.error,
        'Olvidó su password?',
        3000,
        null,
        null,
        ''
      );
    } else {
      if (!this.props.loading && this.props.forgotUserMail === 'success')
        NotificationManager.success(
          'Por favor, verifique su mail',
          'Recuperación de password exitosa',
          3000,
          null,
          null,
          ''
        );
    }
  }

  render() {
    const { email } = this.state;
    const initialValues = { email };

    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h2">třída</p>
              <p className="white mb-0">
                Por favor, use su mail para reiniciar su password.
                <br />
                Si todavía no es miembro, por favor{' '}
                <NavLink to={`/register`} className="btn-link">
                  regístrese
                </NavLink>
                .
              </p>
            </div>
            <div className="form-side">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.forgot-password" />
              </CardTitle>

              <Formik
                initialValues={initialValues}
                onSubmit={this.onForgotPassword}
              >
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
                      />
                      {errors.email && touched.email && (
                        <div className="invalid-feedback d-block">
                          {errors.email}
                        </div>
                      )}
                    </FormGroup>

                    <div className="d-flex justify-content-between align-items-right">
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
                          <IntlMessages id="user.reset-password-button" />
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
  const { forgotUserMail, loading, error } = authUser;
  return { forgotUserMail, loading, error };
};

export default connect(mapStateToProps, {
  forgotPassword,
})(ForgotPassword);
