import React, { Component } from 'react';
import { Row, Button, Label, FormGroup } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { injectIntl } from 'react-intl';
import IntlMessages from 'helpers/IntlMessages';
import { Formik, Form, Field } from 'formik';
import { auth, functions } from 'helpers/Firebase';

import { passwordSchema } from './validations';
import {
  enviarNotificacionExitosa,
  enviarNotificacionError,
} from 'helpers/Utils-ui';
import { passwordChangeMail } from 'constants/emailTexts';

class PasswordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      confirmPassword: '',
      isLoading: false,
    };
  }

  sendPasswordChangeEmail = async (email, options) => {
    const sendMail = functions.httpsCallable('sendMail');
    sendMail({ email, ...options }).catch(function (error) {
      console.log(error);
    });
  };

  onSubmit = async (values) => {
    this.setState({ isLoading: true });
    var user = auth.currentUser;

    try {
      user.updatePassword(values.password);
      enviarNotificacionExitosa(
        'Contraseña actualizada con éxito',
        'Contraseña actualizada!'
      );
      await this.sendPasswordChangeEmail(user.email, passwordChangeMail);
    } catch (err) {
      enviarNotificacionError(
        'Hubo un error al actualizar la contraseña',
        'Ups!'
      );
    }
    this.setState({ isLoading: false });
  };

  render() {
    const { isLoading, password, confirmPassword } = this.state;
    const initialValues = { password, confirmPassword };
    return isLoading ? (
      <div className="loading" />
    ) : (
      <>
        <Row className="h-100">
          <Colxx>
            <Formik
              initialValues={initialValues}
              onSubmit={this.onSubmit}
              validationSchema={passwordSchema}
            >
              {({ errors, touched }) => (
                <Form className="av-tooltip tooltip-label-bottom">
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="user.password" />
                    </Label>
                    <Field
                      type="password"
                      className="form-control"
                      name="password"
                      autoComplete="off"
                    />
                    {errors.password && touched.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    )}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="user.confirmar-password" />
                    </Label>
                    <Field
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      autoComplete="off"
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div className="invalid-feedback d-block">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </FormGroup>
                  <Row className="button-group mr-0">
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
                        <IntlMessages id="cuenta.cambiar-contraseña" />
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

export default injectIntl(PasswordForm);
