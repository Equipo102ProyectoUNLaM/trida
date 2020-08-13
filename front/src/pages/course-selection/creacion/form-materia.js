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
import { addToMateriasCollection } from 'helpers/Firebase-db';
import { functions } from 'helpers/Firebase';

class FormMateria extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEmpty: false,
      nombre: '',
      isLoading: false,
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  onUserSubmit = async () => {
    const { cursoId, instId } = this.props.location;
    let { user } = this.props;
    const obj = {
      nombre: this.state.nombre,
    };
    const matRef = await addToMateriasCollection(
      instId,
      cursoId,
      obj,
      user,
      'Materia agregada!',
      'Materia agregada exitosamente',
      'Error al agregar la materia'
    );
    let { id } = matRef;
    localStorage.setItem('subject', JSON.stringify({ id, name: obj.nombre }));
    try {
      this.setState({ isLoading: true });
      const asignarMateriasAction = functions.httpsCallable('asignarMaterias');
      await asignarMateriasAction({
        instId,
        cursoId,
        id,
        uid: user,
      });
    } catch (error) {
      console.log(error);
    }
    this.setState({ isLoading: false });
    this.props.history.push('/app/home');
  };

  render() {
    const { isLoading } = this.state;

    return isLoading ? (
      <div className="cover-spin" />
    ) : (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="form-side-full">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="materia.complete-datos" />
              </CardTitle>
              <Formik onSubmit={this.onUserSubmit}>
                {({ errors, touched }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="materia.nombre" />
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
                    <p className="tip-text">Ejemplo: &quot;Matemática&quot;</p>
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
                          <IntlMessages id="materia.crear" />
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

export default withRouter(connect(mapStateToProps)(FormMateria));
