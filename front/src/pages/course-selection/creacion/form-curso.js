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
import TagsInput from 'react-tagsinput';
import { toolTipCursos } from 'constants/texts';

class FormCurso extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEmpty: false,
      nombre: '',
      cursosTags: [],
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleTagChange = (cursosTags) => {
    this.setState({ cursosTags });
  };

  onUserSubmit = async () => {
    const { instId } = this.props.location;
    const { cursosTags } = this.state;
    let arrayCursos = [];

    for (const tag in cursosTags) {
      const cursoObj = {
        nombre: cursosTags[tag],
      };
      const docRef = await addToSubCollection(
        'instituciones',
        instId,
        'cursos',
        cursoObj,
        this.props.user,
        'Curso agregado!',
        'Curso agregado exitosamente',
        'Error al agregar el curso'
      );
      arrayCursos.push({ id: docRef.id, nombre: cursoObj.nombre });
    }

    this.props.history.push({
      pathname: '/seleccion-curso/crear-materia',
      cursos: arrayCursos,
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
                    <FormGroup>
                      <p className="tip-text">{toolTipCursos}</p>
                      <div className="form-group has-float-label">
                        <TagsInput
                          value={this.state.cursosTags}
                          onChange={this.handleTagChange}
                          inputProps={{
                            placeholder: '',
                          }}
                        />
                        <IntlMessages id="curso.nombre" />
                      </div>
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
