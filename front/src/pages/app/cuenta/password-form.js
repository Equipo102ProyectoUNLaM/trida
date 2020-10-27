import React, { Component } from 'react';
import { Row, Button, Label, FormGroup } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { injectIntl } from 'react-intl';
import IntlMessages from 'helpers/IntlMessages';
import { Formik, Form, Field } from 'formik';
import { auth } from 'helpers/Firebase';

import { passwordSchema } from './validations';
import {
  enviarNotificacionExitosa,
  enviarNotificacionError,
} from 'helpers/Utils-ui';

class PasswordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      confirmPassword: '',
    };
  }

  onSubmit = (values) => {
    var user = auth.currentUser;
    try {
      user.updatePassword(values.password);
      enviarNotificacionExitosa(
        'Contraseña actualizada con éxito',
        'Contraseña actualizada!'
      );
    } catch (err) {
      enviarNotificacionError(
        'Hubo un error al actualizar la contraseña',
        'Ups!'
      );
    }
  };

  render() {
    const { password, confirmPassword } = this.state;
    const initialValues = { password, confirmPassword };
    return (
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
