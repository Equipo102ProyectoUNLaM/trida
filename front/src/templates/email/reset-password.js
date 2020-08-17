import React, { Component } from 'react';
import { auth } from 'helpers/Firebase';
import UserLayout from 'layout/UserLayout';
import { NavLink } from 'react-router-dom';
import {
  Row,
  Card,
  CardTitle,
  Label,
  FormGroup,
  Button,
  CardBody,
} from 'reactstrap';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { Colxx } from '../../components/common/CustomBootstrap';
import IntlMessages from '../../helpers/IntlMessages';

const ResetPassSchema = Yup.object().shape({
  password: Yup.string().required('Debe ingresar una contraseña'),
});

export default class ResetPassword extends Component {
  state = {
    email: null,
    error: '',
    password: '',
    success: false,
    validCode: null,
    verifiedCode: false,
  };

  componentDidMount() {
    // Verify the password reset code is valid.
    auth.verifyPasswordResetCode(this.props.actionCode).then(
      (email) => {
        this.setState({ email, validCode: true, verifiedCode: true });
      },
      (error) => {
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
        this.setState({
          error: error.message,
          validCode: false,
          verifiedCode: true,
        });
      }
    );
  }

  handleResetPassword = (values) => {
    const { actionCode } = this.props;
    const newPassword = values.password;

    // Save the new password.
    auth.confirmPasswordReset(actionCode, newPassword).then(
      () => {
        // Password reset has been confirmed and new password updated.
        this.setState({ success: true });
      },
      (error) => {
        // Error occurred during confirmation. The code might have expired or the
        // password is too weak.
        this.setState({ error: error.message });
      }
    );
  };

  render() {
    const { email, error, success, validCode, verifiedCode } = this.state;

    let component;
    if (!verifiedCode) {
      component = <div className="loading" />;
    } else if (success) {
      component = (
        <UserLayout>
          <Row className="h-100">
            <Colxx xxs="12" md="10" className="mx-auto my-auto">
              <Card className="auth-card">
                <div className="form-side-full">
                  <CardTitle>
                    <h1>Su contraseña ha sido modificada correctamente</h1>
                  </CardTitle>
                  <CardBody>
                    <h4>
                      Ahora puede iniciar sesión con su nueva contraseña en
                    </h4>
                    <NavLink to={`/`}>
                      <h4>trida.com.ar</h4>
                    </NavLink>
                  </CardBody>
                </div>
              </Card>
            </Colxx>
          </Row>
        </UserLayout>
      );
    } else if (verifiedCode && validCode) {
      component = (
        <UserLayout>
          <Row className="h-100">
            <Colxx xxs="12" md="10" className="mx-auto my-auto">
              <Card className="auth-card">
                <div className="form-side-full">
                  <CardTitle className="mb-4">
                    <IntlMessages id="user.cambie-password" />
                    <h5>para el mail {email} </h5>
                  </CardTitle>
                  <Formik
                    initialValues={{ password: '' }}
                    onSubmit={this.handleResetPassword}
                    validationSchema={ResetPassSchema}
                  >
                    {({ errors, touched }) => (
                      <Form className="error-l-100 tooltip-label-right">
                        <FormGroup className="error-l-100">
                          <Label>
                            <IntlMessages id="user.password" />
                          </Label>
                          <Field
                            className="form-control"
                            type="password"
                            name="password"
                            placeholder="Ingresá tu nueva contraseña"
                          />
                          {errors.password && touched.password ? (
                            <div className="invalid-feedback d-block">
                              {errors.password}
                            </div>
                          ) : null}
                        </FormGroup>

                        <Row className="button-group">
                          <Button
                            color="primary"
                            className={`btn-shadow btn-multiple-state ${
                              this.props.loading ? 'show-spinner' : ''
                            }`}
                            type="submit"
                            size="lg"
                          >
                            CAMBIAR CONTRASEÑA
                          </Button>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Card>
            </Colxx>
          </Row>
        </UserLayout>
      );
    } else if (verifiedCode && !validCode) {
      component = (
        <UserLayout>
          <Row className="h-100">
            <Colxx xxs="12" md="10" className="mx-auto my-auto">
              <Card className="auth-card">
                <div className="form-side-full">
                  <CardTitle>
                    <h1>Intente cambiar su contraseña nuevamente</h1>
                  </CardTitle>
                  <CardBody>
                    <h4>{error}</h4>
                  </CardBody>
                </div>
              </Card>
            </Colxx>
          </Row>
        </UserLayout>
      );
    }

    return component;
  }
}
