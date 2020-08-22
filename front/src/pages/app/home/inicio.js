import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import CardInicio from 'components/cards-inicio';
import { getCourses, getInstituciones } from 'helpers/Firebase-user';
import { updateInstitution, updateSubject, updateCourse } from 'redux/actions';

class Inicio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instRef: [],
      items: [],
      isLoading: true,
      showCourses: false,
      showSubjects: false,
      instId: '',
      instObj: {},
      courseId: '',
      courseObj: {},
      courses: [],
      subjects: [],
    };
  }

  componentDidMount() {
    this.getInstituciones();
  }

  getInstituciones = async () => {
    try {
      const items = await getInstituciones(this.props.user);
      this.dataListRenderer(items);
    } catch (err) {
      console.log('Error getting documents', err);
    }
  };

  showCourses = (institution) => {
    this.setState({
      showCourses: true,
      showSubjects: false,
      isLoading: true,
      courses: [],
      subjects: [],
      instId: institution.id,
      instObj: institution,
    });
    this.getUserCourses(institution.id, this.props.user);
  };

  showSubjects = (course) => {
    const [array] = this.state.courses;
    this.setState({
      showSubjects: true,
      subjects: array.subjects,
      courseId: course.id,
      courseObj: course,
    });
  };

  navigateToSubject = (subject) => {
    this.props.updateInstitution(this.state.instObj);
    this.props.updateCourse(this.state.courseObj);
    this.props.updateSubject(subject);
  };

  async getUserCourses(institutionId, userId) {
    let array = [];
    this.setState({
      isLoading: true,
    });
    try {
      array = await getCourses(institutionId, userId);
    } catch (err) {
      console.log('Error getting documents', err);
    } finally {
      this.setState({
        isLoading: false,
        courses: array,
      });
    }
  }

  dataListRenderer(array) {
    this.setState({
      items: array,
      isLoading: false,
      courses: [],
      subjects: [],
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
      <div className="cover-spin" />
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
                    showChildren={() => this.showCourses(institution)}
                    key={institution.id}
                    item={institution}
                    itemId={institution.id}
                  />
                );
              })}{' '}
            </Row>
          </Colxx>
          {showCourses && (
            <>
              <Separator className="mb-5" />
              <Colxx xxs="12">
                <h2>
                  <IntlMessages id="menu.mis-cursos" />
                </h2>
              </Colxx>
              <Colxx xxs="6">
                <Row>
                  {courses.map((course) => {
                    return (
                      <CardInicio
                        showChildren={() => this.showSubjects(course)}
                        key={course.id}
                        item={course}
                        itemId={course.id}
                      />
                    );
                  })}{' '}
                </Row>
              </Colxx>
            </>
          )}
          {showSubjects && (
            <>
              <Separator className="mb-5" />
              <Colxx xxs="12">
                <h2>
                  <IntlMessages id="menu.mis-materias" />
                </h2>
              </Colxx>
              <Colxx xxs="6">
                <Row>
                  {subjects.map((subject) => {
                    return (
                      <CardInicio
                        showChildren={() => this.navigateToSubject(subject)}
                        key={subject.id}
                        item={subject}
                        itemId={subject.id}
                      />
                    );
                  })}{' '}
                </Row>
              </Colxx>
            </>
          )}
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;

  return {
    user,
  };
};

export default connect(mapStateToProps, {
  updateInstitution,
  updateCourse,
  updateSubject,
})(Inicio);
