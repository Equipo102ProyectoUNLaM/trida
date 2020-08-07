import React, { Component } from 'react';
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
  NavLink,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from 'redux/actions';
import IntlMessages from 'helpers/IntlMessages';
import { Formik, Form, Field } from 'formik';

class FormInstitucion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      isEmpty: false,
    };
  }

  handleLogout = () => {
    this.props.logoutUser(this.props.history);
  };

  render() {
    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="form-side-full">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="institucion.complete-datos" />
              </CardTitle>
              <Formik onSubmit={this.onUserSubmit}>
                {({ errors, touched }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.nombre" />
                      </Label>
                      <Field
                        className="form-control"
                        name="nombre"
                        onChange={this.handleChange}
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
                        onChange={this.handleChange}
                      />
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
                            Seleccione su foto
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

export default withRouter(
  connect(null, {
    logoutUser,
  })(FormInstitucion)
);
