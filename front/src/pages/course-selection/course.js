import React, { Fragment, Component } from 'react';
import {
  Collapse,
  Button,
  Row,
  Card,
  CardSubtitle,
  CardBody,
  CardTitle,
  Jumbotron,
} from 'reactstrap';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx } from '../../components/common/CustomBootstrap';
import { withRouter } from 'react-router-dom';
import { courses } from './../../data/courses';
import { firestore } from 'helpers/Firebase';

const HOME_URL = '/app/home';

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoading: true,
    };
  }

  getCourses = async () => {
    const { institutionId } = this.props.match.params;
    const user_courses = await this.getUserCourses(institutionId);
    this.dataListRender(user_courses);
  };

  dataListRender(array) {
    this.setState({
      items: array,
      isLoading: false,
    });
  }

  async getUserCourses(institutionId) {
    var userId = localStorage.getItem('user_id');
    var array = [];
    try {
      const userRef = firestore.doc(`users/${userId}`);
      var userDoc = await userRef.get();
      const { instituciones } = userDoc.data(); //Traigo las instituciones del usuario
      var instf = instituciones.filter(
        (i) => i.institucion_id.id == institutionId
      ); //Busco la que seleccionó anteriormente
      for (const c of instf[0].cursos) {
        //Itero en sus cursos, me traigo toda la info del documento
        const courseRef = firestore.doc(`${c.curso_id.path}`);
        var courseDoc = await courseRef.get();
        const { nombre } = courseDoc.data();
        var subjects_with_data = await this.renderSubjects(c.materias); //Busco las materias que tiene asignadas
        const obj = {
          id: c.curso_id.id,
          subjects: subjects_with_data,
          name: nombre,
        };
        array.push(obj); //Armo el array con la info del curso y las materias
      }
      return array;
    } catch (err) {
      console.log('Error getting documents', err);
    }
  }

  async renderSubjects(materiasIds) {
    const array = [];
    try {
      for (const m of materiasIds) {
        //Busco los documentos de las materias y me traigo la info
        const matRef = firestore.doc(`${m.path}`);
        var matDoc = await matRef.get();
        const { nombre } = matDoc.data();
        const obj = {
          id: m.id,
          name: nombre,
        };
        array.push(obj);
      }
      return array;
    } catch (err) {
      console.log('Error getting documents', err);
    }
  }

  componentDidMount() {
    this.getCourses();
  }

  toggle = (i) => {
    var prevState = this.state.items;
    prevState[i].collapsed = !prevState[i].collapsed;
    this.setState({
      items: prevState,
    });
  };

  onCourseSelection(subject, course) {
    if (subject) localStorage.setItem('subject', JSON.stringify(subject));
    if (course) localStorage.setItem('course', JSON.stringify(course));
    this.props.history.push(HOME_URL);
  }

  render() {
    const { items, isLoading } = this.state;
    const { history } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row className="course-row-container">
          <Colxx xxs="12" className="mb-4 course-col-container">
            <Card className="course-card-center">
              <CardBody>
                <Jumbotron>
                  <h2 className="display-5">
                    <IntlMessages id="course.selection" />
                  </h2>
                  <hr className="my-4" />
                  <Row>
                    {this.state.items.map((course, index) => {
                      return (
                        <Row key={index} className="mb-4 col-4">
                          <Colxx>
                            <Button
                              color="primary"
                              onClick={() => this.toggle(index)}
                              block
                              className="mb-2"
                            >
                              {course.name}
                            </Button>
                            <Collapse isOpen={course.collapsed}>
                              {course.subjects.map((subject, i) => {
                                return (
                                  <Row key={i + 'div'}>
                                    <h4
                                      className="subject"
                                      onClick={() =>
                                        this.onCourseSelection(subject, course)
                                      }
                                    >
                                      {subject.name}{' '}
                                    </h4>
                                  </Row>
                                );
                              })}
                            </Collapse>
                          </Colxx>
                        </Row>
                      );
                    })}{' '}
                  </Row>
                </Jumbotron>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
export default withRouter(Course);
