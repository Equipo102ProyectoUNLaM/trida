import React, { Component } from 'react';
import { Row, Card, CardTitle, Label, Button, FormGroup } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { NotificationManager } from 'components/common/react-notifications';
import { resetPassword } from 'redux/actions';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx } from 'components/common/CustomBootstrap';
import { passwordSchema } from './validations';
import { connect } from 'react-redux';

class CambiarPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      confirmPassword: '',
    };
  }

  onUserSubmit = () => {
    if (!this.props.loading) {
      const params = new URLSearchParams(this.props.location.search);
      const oobCode = params.get('oobCode');
      if (oobCode) {
        if (this.state.password !== '') {
          this.props.resetPassword({
            newPassword: this.state.password,
            resetPasswordCode: oobCode,
            history: this.props.history,
          });
        }
      } else {
        NotificationManager.warning(
          'Please check your email url.',
          'Reset Password Error',
          3000,
          null,
          null,
          ''
        );
      }
    }
  };

  componentDidUpdate() {
    if (this.props.error) {
      NotificationManager.error(
        this.props.error,
        'Error en el registro',
        4000,
        null,
        null,
        ''
      );
    }
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { password, confirmPassword } = this.state;
    const initialValues = { password, confirmPassword };

    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="form-side-full">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.cambie-password" />
              </CardTitle>
              <Formik
                initialValues={initialValues}
                onSubmit={this.onUserSubmit}
                validationSchema={passwordSchema}
              >
                {({ errors, touched }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.password" />
                      </Label>
                      <Field
                        className="form-control"
                        type="password"
                        name="password"
                        onChange={this.handleChange}
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
                        className="form-control"
                        type="password"
                        name="confirmPassword"
                        onChange={this.handleChange}
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="invalid-feedback d-block">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </FormGroup>
                    <Row className="button-group">
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
  const { newPassword, resetPasswordCode, loading, error } = authUser;
  return { newPassword, resetPasswordCode, loading, error };
};

export default connect(mapStateToProps, {
  resetPassword,
})(CambiarPassword);
