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
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { NotificationManager } from 'components/common/react-notifications';

import IntlMessages from 'helpers/IntlMessages';
import { Colxx } from 'components/common/CustomBootstrap';

class PrimerLogin extends Component {
  constructor(props) {
    super(props);
  }

  onUserSubmit = (values) => {
    if (!this.props.loading) {
      if (values.email !== '' && values.password !== '' && values.name !== '') {
        this.props.registerUser(values, this.props.history);
      } else {
        NotificationManager.error(
          'Complete todos los campos',
          'Error',
          4000,
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

  setSelectedFile = (event) => {
    var file = document.getElementById('upload-photo');
    console.log(file);
  };

  render() {
    //const { password, email, name } = this.state;
    //const initialValues = {email, password, name};

    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="form-side-full">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.complete-datos" />
              </CardTitle>
              <Formik
                //initialValues={initialValues}
                onSubmit={this.onUserSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.nombre" />
                      </Label>
                      <Field className="form-control" name="name" />
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.apellido" />
                      </Label>
                      <Field className="form-control" name="apellido" />
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.telefono" />
                      </Label>
                      <Field className="form-control" name="telefono" />
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
                            name="customFile"
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

export default PrimerLogin;
