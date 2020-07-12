import React, { Component, Fragment } from 'react';
import { Row, Card, CardTitle, CardBody, CardText, NavLink } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { firestore } from 'helpers/Firebase';
import { ContextMenuTrigger } from 'react-contextmenu';
import CardInicio from 'components/cards-inicio';

export default class Inicio extends Component {
  constructor(props) {
    super(props);
    var userId = localStorage.getItem('user_id');
    this.state = {
      userId,
      items: [],
      isLoading: true,
      showCourses: false,
      instId: '',
      courses: [],
    };
  }

  componentDidMount() {
    this.getInstituciones();
  }

  getInstituciones = async () => {
    const array = [];
    try {
      const userRef = firestore.doc(`users/${this.state.userId}`);
      var userDoc = await userRef.get();
      const { instituciones } = userDoc.data();
      console.log(instituciones);
      if (!instituciones) return;
      for (const inst of instituciones) {
        const institutionRef = firestore.doc(`${inst.institucion_id.path}`);
        var institutionDoc = await institutionRef.get();
        const { nombre, niveles } = institutionDoc.data();
        const obj = {
          id: inst.institucion_id.id,
          name: nombre,
          tags: niveles,
        };
        array.push(obj);
      }
    } catch (err) {
      console.log('Error getting documents', err);
    } finally {
      this.dataListRenderer(array);
    }
  };

  showCourses = (institutionId) => {
    console.log(institutionId);
    this.setState({
      showCourses: true,
      isLoading: true,
    });
    this.getUserCourses(institutionId);
  };

  async getUserCourses(institutionId) {
    var array = [];
    try {
      const userRef = firestore.doc(`users/${this.state.userId}`);
      var userDoc = await userRef.get();
      const { instituciones } = userDoc.data(); //Traigo las instituciones del usuario
      var instf = instituciones.filter(
        (i) => i.institucion_id.id === institutionId
      ); //Busco la que seleccionó anteriormente
      for (const c of instf[0].cursos) {
        //Itero en sus cursos, me traigo toda la info del documento
        const courseRef = firestore.doc(`${c.curso_id.path}`);
        var courseDoc = await courseRef.get();
        const { nombre } = courseDoc.data();
        //var subjects_with_data = await this.renderSubjects(c.materias); //Busco las materias que tiene asignadas
        const obj = {
          id: c.curso_id.id,
          //subjects: subjects_with_data,
          name: nombre,
        };
        array.push(obj); //Armo el array con la info del curso y las materias
      }
      this.setState({
        courses: array,
        isLoading: false,
      });
    } catch (err) {
      console.log('Error getting documents', err);
    }
  }

  dataListRenderer(array) {
    this.setState({
      items: array,
      isLoading: false,
    });
  }

  render() {
    const { items, isLoading, showCourses, courses } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <h1>
              <IntlMessages id="menu.start" />
            </h1>
            <Separator className="mb-5" />
          </Colxx>
          <Row>
            {items.map((institution) => {
              return (
                <CardInicio
                  showCourses={this.showCourses}
                  key={institution.id}
                  item={institution}
                  instId={institution.id}
                />
              );
            })}{' '}
          </Row>
          {showCourses && (
            <Row>
              {courses.map((course) => {
                return (
                  <Colxx sm="12" lg="8" xl="6" className="mb-4" key={course.id}>
                    <NavLink className="subject">
                      <ContextMenuTrigger id="menu_id" data={course.id}>
                        <Card className="card-inicio">
                          <CardBody className="card-body">
                            <Row>
                              <Colxx xxs="16" className="mb-4">
                                <CardTitle className="mb-3">
                                  {course.name}
                                </CardTitle>
                                <CardText className="text-muted text-small mb-3 font-weight-light">
                                  test
                                </CardText>
                                <CardText className="text-muted text-medium mb-0 font-weight-semibold">
                                  test
                                </CardText>
                              </Colxx>
                            </Row>
                          </CardBody>
                        </Card>
                      </ContextMenuTrigger>
                    </NavLink>
                  </Colxx>
                );
              })}{' '}
            </Row>
          )}
        </Row>
      </Fragment>
    );
  }
}
