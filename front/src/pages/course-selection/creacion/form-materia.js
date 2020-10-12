import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Card, CardTitle, Button, FormGroup } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Formik, Form } from 'formik';
import { addToMateriasCollection } from 'helpers/Firebase-db';
import { editDocument } from 'helpers/Firebase-db';
import TagsInput from 'react-tagsinput';
import { toolTipMaterias } from 'constants/texts';
import { isEmpty } from 'helpers/Utils';
import { enviarNotificacionExitosa } from 'helpers/Utils-ui';
import 'react-tagsinput/react-tagsinput.css';

class FormMateria extends Component {
  constructor(props) {
    super(props);
    const { instId, instRef, cursos, agregado } = this.props.location;
    this.state = {
      isEmpty: false,
      nombre: '',
      isLoading: false,
      materiasTags: {},
      instId,
      instRef,
      cursos,
      agregado,
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  onUserSubmit = async () => {
    let { user } = this.props;
    const { materiasTags, instId, instRef, cursos, agregado } = this.state;
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
          user
        );

        await editDocument('usuariosPorMateria', matRef.id, {
          usuario_id: [user],
        });
        arrayMaterias.push(matRef);
      }
      const cursoObj = {
        curso_id: cursos[id].ref,
        materias: arrayMaterias,
      };
      cursosObj.push(cursoObj);
    }
    
    if (!agregado) {
      instObj = [
        {
          institucion_id: instRef,
          cursos: cursosObj,
        },
      ];
      await editDocument(
        'usuarios',
        user,
        { instituciones: instObj },
        'Materia editada'
      );
    }

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
              <div className="logo-single-theme" />
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
                        disabled={isEmpty(this.state.materiasTags)}
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
