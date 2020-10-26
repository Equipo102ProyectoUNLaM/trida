import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Button,
  Label,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import { injectIntl } from 'react-intl';
import IntlMessages from 'helpers/IntlMessages';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { Formik, Form, Field } from 'formik';
import { enviarNotificacionError } from 'helpers/Utils-ui';
import { editDocument } from 'helpers/Firebase-db';
import { updateDatosUsuario } from 'redux/actions';
import { getUserData } from 'helpers/Firebase-user';
import { storage } from 'helpers/Firebase';
import { datosSchema } from './validations';

class Cuenta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: false,
      accordion: [],
      data: [],
    };
  }

  /*   updateEmail = () => {
    var user = firebase.auth().currentUser;

    user.updateEmail("user@example.com").then(function() {
    }).catch(function(error) {
    });
  } */

  render() {
    const { data } = this.state;
    const initialValues = { nombre: '', apellido: '' };
    return (
      <>
        <HeaderDeModulo
          heading="menu.mi-cuenta"
          toggleModal={() => this.props.history.push('/app/home')}
          buttonText="menu.volver"
        />
        <Row className="cuenta-subtitle mb-3 ml-0">
          <IntlMessages id="cuenta.mis-datos" />{' '}
        </Row>
        <Row className="h-100">
          <Formik
            initialValues={initialValues}
            onSubmit={this.onUserSubmit}
            validationSchema={datosSchema}
          >
            {({ errors, touched }) => (
              <Form className="av-tooltip tooltip-label-bottom">
                <FormGroup className="form-group has-float-label">
                  <Label>
                    <IntlMessages id="user.nombre" />
                  </Label>
                  <Field
                    className="form-control"
                    name="nombre"
                    autoComplete="off"
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
                    autoComplete="off"
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
                    autoComplete="off"
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
                        {this.state.fotoPerfilText}
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
                      <IntlMessages id="cuenta.guardar-datos" />
                    </span>
                  </Button>
                </Row>
              </Form>
            )}
          </Formik>
        </Row>
        <Row className="cuenta-subtitle mb-3 ml-0">
          <IntlMessages id="cuenta.password" />{' '}
        </Row>
      </>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { userData } = authUser;
  const { rol } = userData;
  return {
    rol,
  };
};

export default injectIntl(connect(mapStateToProps)(Cuenta));
