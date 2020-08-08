import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Card,
  CardTitle,
  Label,
  Button,
  FormGroup,
  NavLink,
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Formik, Form, Field } from 'formik';
import { addToSubCollection } from 'helpers/Firebase-db';

class FormCurso extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEmpty: false,
      nombre: '',
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  onUserSubmit = async () => {
    const { instId } = this.props.location;
    const obj = {
      nombre: this.state.nombre,
    };
    const docRef = await addToSubCollection(
      'instituciones',
      instId,
      'cursos',
      obj,
      this.props.user,
      'Curso agregado!',
      'Curso agregado exitosamente',
      'Error al agregar el curso'
    );
    localStorage.setItem(
      'course',
      JSON.stringify({ id: docRef.id, name: obj.nombre })
    );
    this.props.history.push({
      pathname: '/seleccion-curso/crear-materia',
      cursoId: docRef.id,
      instId,
    });
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
                <IntlMessages id="curso.complete-datos" />
              </CardTitle>
              <Formik onSubmit={this.onUserSubmit}>
                {({ errors, touched }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="curso.nombre" />
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
                    <p className="tip-text">Ejemplo: &quot;1er grado&quot;</p>
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
                          <IntlMessages id="curso.crear" />
                        </span>
                      </Button>
                      <NavLink to="/seleccion-curso/crear-curso" />
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

export default withRouter(connect(mapStateToProps)(FormCurso));
