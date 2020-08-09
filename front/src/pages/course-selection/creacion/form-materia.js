import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Card, CardTitle, Button, FormGroup, NavLink } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Formik, Form } from 'formik';
import { addToMateriasCollection } from 'helpers/Firebase-db';
import { editDocument } from 'helpers/Firebase-db';
import TagsInput from 'react-tagsinput';
import { toolTipMaterias } from 'constants/texts';

class FormMateria extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEmpty: false,
      nombre: '',
      isLoading: false,
      materiasTags: {},
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  onUserSubmit = async () => {
    const { instId, instRef, cursos } = this.props.location;
    let { user } = this.props;
    const { materiasTags } = this.state;
    let instObj,
      cursosObj = [];

    this.setState({ isLoading: true });
    for (const id in materiasTags) {
      let arrayMaterias = [];
      const materiasPorCurso = materiasTags[id];

      for (const materia in materiasPorCurso) {
        const matRef = await addToMateriasCollection(
          instId,
          id,
          { nombre: materiasPorCurso[materia] },
          user,
          'Materia agregada!',
          'Materia agregada exitosamente',
          'Error al agregar la materia'
        );
        arrayMaterias.push(matRef);
      }
      const cursoObj = {
        curso_id: cursos[id].ref,
        materias: arrayMaterias,
      };
      cursosObj.push(cursoObj);
    }

    instObj = [
      {
        institucion_id: instRef,
        cursos: cursosObj,
      },
    ];
    await editDocument('usuarios', user, { instituciones: instObj }, 'Materia');

    this.setState({ isLoading: false });
    this.props.history.push('/seleccion-curso');
  };

  handleTagChange = (curso, materias) => {
    this.setState({
      materiasTags: {
        ...this.state.materiasTags,
        [curso]: materias,
      },
    });
  };

  render() {
    const { isLoading } = this.state;
    const { cursos } = this.props.location;
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
                    <p className="tip-text">{toolTipMaterias}</p>
                    {Object.keys(cursos).map((curso) => {
                      return (
                        <FormGroup key={curso}>
                          <div className="form-group has-float-label">
                            <TagsInput
                              value={this.state.materiasTags[curso] || []}
                              onChange={(materias) =>
                                this.handleTagChange(curso, materias)
                              }
                              inputProps={{
                                placeholder: '',
                              }}
                            />
                            <span className="span-float-label">
                              Materias de {cursos[curso].nombre}
                            </span>
                          </div>
                        </FormGroup>
                      );
                    })}
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
