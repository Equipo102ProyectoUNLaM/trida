import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Card, CardTitle, Button, FormGroup, NavLink } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Formik, Form } from 'formik';
import { addToSubCollection } from 'helpers/Firebase-db';
import TagsInput from 'react-tagsinput';
import { toolTipCursos } from 'constants/texts';
import { isEmpty } from 'helpers/Utils';
import 'react-tagsinput/react-tagsinput.css';
import { enviarNotificacionExitosa } from 'helpers/Utils-ui';

class FormCurso extends Component {
  constructor(props) {
    super(props);

    const { instId, instRef, agregado } = this.props.location;
    this.state = {
      isEmpty: false,
      nombre: '',
      cursosTags: [],
      instId: agregado ? this.props.institution.id : instId,
      instRef,
      agregado,
    };
  }

  componentDidMount() {
    const { instId, instRef, agregado } = this.props.location;
    this.setState({ instId, instRef, agregado });
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleTagChange = (cursosTags) => {
    this.setState({ cursosTags });
  };

  onUserSubmit = async () => {
    const { cursosTags, instId, instRef, agregado } = this.state;

    const cursosMapeados = {};

    for (const tag in cursosTags) {
      const cursoObj = {
        nombre: cursosTags[tag],
      };
      const docRef = await addToSubCollection(
        'instituciones',
        instId,
        'cursos',
        cursoObj,
        this.props.user
      );
      cursosMapeados[docRef.id] = { ref: docRef, nombre: cursoObj.nombre };
    }

    enviarNotificacionExitosa(
      'Cursos agregados exitosamente',
      'Cursos agregados!'
    );

    this.props.history.push({
      pathname: '/seleccion-curso/crear-materia',
      cursos: cursosMapeados,
      instId: agregado ? this.props.institution.id : instId,
      instRef,
      agregado,
    });
  };

  render() {
    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="form-side-full">
              <div className="logo-single-theme" />
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
                        disabled={isEmpty(this.state.cursosTags)}
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

const mapStateToProps = ({ authUser, seleccionCurso }) => {
  const { user } = authUser;
  const { institution } = seleccionCurso;

  return {
    user,
    institution,
  };
};

export default withRouter(connect(mapStateToProps)(FormCurso));
