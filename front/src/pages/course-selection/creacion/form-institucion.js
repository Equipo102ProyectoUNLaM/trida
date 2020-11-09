import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Card, CardTitle, Label, Button, FormGroup } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import { Colxx } from 'components/common/CustomBootstrap';
import TIPOS_INSTITUCION from 'constants/tiposInstitucion';
import NIVELES from 'constants/niveles';
import IntlMessages from 'helpers/IntlMessages';
import { addDocument } from 'helpers/Firebase-db';
import { Formik, Form, Field } from 'formik';
import { formInstitucionSchema } from '../validations';

class FormInstitucion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      isEmpty: false,
      institucionOptions: TIPOS_INSTITUCION,
      nivelesOptions: NIVELES,
      selectedInst: '',
      selectedNiveles: [],
      nombre: '',
    };
  }

  handleInstChange = (selectedInst) => {
    if (selectedInst) {
      this.setState({ selectedInst });
    } else {
      this.setState({
        selectedInst: '',
      });
    }
  };

  handleNivelesChange = (selectedNiveles) => {
    this.setState({ selectedNiveles });
  };

  onUserSubmit = async (values) => {
    const { nombre, telefono } = values;
    const nivelesState = [...this.state.selectedNiveles];
    const nivelesArray = nivelesState.map((elem) => elem.value);

    const obj = {
      niveles: nivelesArray,
      nombre: nombre,
      telefono: telefono,
      tipo: this.state.selectedInst.value,
    };
    const instRef = await addDocument(
      'instituciones',
      obj,
      this.props.user,
      'Institucion creada!',
      'Institución creada con éxito',
      'Error al crear la Institución'
    );
    this.props.history.push({
      pathname: '/seleccion-curso/crear-curso',
      instRef: instRef,
      instId: instRef.id,
      agregado: false,
    });
  };

  render() {
    const {
      selectedInst,
      institucionOptions,
      selectedNiveles,
      nivelesOptions,
    } = this.state;
    const initialValues = { nombre: '' };
    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="form-side-full">
              <div className="logo-single-theme" />
              <CardTitle className="mb-4">
                <IntlMessages id="institucion.complete-datos" />
              </CardTitle>
              <Formik
                initialValues={initialValues}
                onSubmit={this.onUserSubmit}
                validationSchema={formInstitucionSchema}
              >
                {({ errors, touched }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="institucion.nombre" />
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
                    <div className="form-group has-float-label">
                      <Select
                        className="react-select"
                        classNamePrefix="select"
                        isClearable={true}
                        name="tipo"
                        options={institucionOptions}
                        value={selectedInst}
                        onChange={this.handleInstChange}
                        isDisabled={false}
                        placeholder="Seleccionar..."
                      />
                      <IntlMessages id="institucion.tipo" />
                    </div>
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="institucion.telefono" />
                      </Label>
                      <Field
                        className="form-control"
                        name="telefono"
                        autoComplete="off"
                      />
                      {errors.telefono && touched.telefono && (
                        <div className="invalid-feedback d-block">
                          {errors.telefono}
                        </div>
                      )}
                    </FormGroup>
                    <div className="form-group has-float-label">
                      <Select
                        className="react-select"
                        classNamePrefix="select"
                        isClearable={true}
                        name="niveles"
                        options={nivelesOptions}
                        value={selectedNiveles}
                        onChange={this.handleNivelesChange}
                        isDisabled={false}
                        placeholder="Seleccionar..."
                        isMulti
                      />
                      <IntlMessages id="institucion.niveles" />
                    </div>
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
                          <IntlMessages id="institucion.crear" />
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
  const { user } = authUser;

  return {
    user,
  };
};

export default withRouter(connect(mapStateToProps)(FormInstitucion));
