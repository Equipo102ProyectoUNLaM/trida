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
      showSubjects: false,
      instId: '',
      courses: [],
      subjects: [],
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
    this.setState({
      showCourses: true,
      isLoading: true,
    });
    this.getUserCourses(institutionId);
  };

  showSubjects = (courseId) => {
    this.setState({
      showSubjects: true,
      isLoading: true,
    });
    this.getUserSubjects(courseId);
  };

  navigateToSubjects = () => {
    console.log('materias');
  };

  async getUserSubjects(materiasIds) {
    const array = [];
    try {
      for (const m of materiasIds) {
        //Busco los documentos de las materias y me traigo la info
        const matRef = firestore.doc(`/${m.path}`);
        var matDoc = await matRef.get();
        const { nombre } = matDoc.data();
        const obj = {
          id: m.id,
          name: nombre,
        };
        array.push(obj);
      }
      this.setState({
        subjects: array,
        isLoading: false,
      });
    } catch (err) {
      console.log('Error getting documents', err);
    }
  }

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
        var subjects_with_data = await this.getUserSubjects(c.materias); //Busco las materias que tiene asignadas
        const obj = {
          id: c.curso_id.id,
          subjects: subjects_with_data,
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
    const {
      items,
      isLoading,
      showCourses,
      courses,
      showSubjects,
      subjects,
    } = this.state;
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
          <Colxx xxs="12">
            <h2>
              <IntlMessages id="menu.mis-instituciones" />
            </h2>
          </Colxx>
          <Colxx xxs="6">
            <Row>
              {items.map((institution) => {
                return (
                  <CardInicio
                    showChildren={this.showCourses}
                    key={institution.id}
                    item={institution}
                    itemId={institution.id}
                  />
                );
              })}{' '}
            </Row>
          </Colxx>
          {showCourses && (
            <Colxx xxs="12">
              <Separator className="mb-5" />
              <Colxx xxs="12">
                <h2>
                  <IntlMessages id="menu.mis-cursos" />
                </h2>
              </Colxx>
              {courses.map((course) => {
                return (
                  <CardInicio
                    showChildren={this.showSubjects}
                    key={course.id}
                    item={course}
                    itemId={course.id}
                  />
                );
              })}{' '}
            </Colxx>
          )}
          {showSubjects && (
            <Colxx xxs="12">
              <Separator className="mb-5" />
              <Colxx xxs="12">
                <h2>
                  <IntlMessages id="menu.mis-materias" />
                </h2>
              </Colxx>
              {subjects.map((subject) => {
                return (
                  <CardInicio
                    showChildren={this.navigateToSubject}
                    key={subject.id}
                    item={subject}
                    itemId={subject.id}
                  />
                );
              })}{' '}
            </Colxx>
          )}
        </Row>
      </Fragment>
    );
  }
}
