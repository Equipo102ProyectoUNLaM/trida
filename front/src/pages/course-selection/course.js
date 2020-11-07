import React, { Fragment, Component } from 'react';
import { Collapse, Button, Row, Card, CardBody, Jumbotron } from 'reactstrap';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx } from '../../components/common/CustomBootstrap';
import { withRouter } from 'react-router-dom';
import { getCourses } from 'helpers/Firebase-user';
import { enviarNotificacionError } from 'helpers/Utils-ui';
import { connect } from 'react-redux';
import { updateSubject, updateCourse } from 'redux/actions';
import CursoCardListView from '../../containers/pages/CursoCardListView';

function collect(props) {
  return { data: props.data };
}

const HOME_URL = '/app/home';

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      institutionId: '',
      course: null,
      courseSelected: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getCourses();
  }

  getCourses = async () => {
    const { institutionId } = this.props.match.params;
    this.setState({ institutionId });
    const user_courses = await this.getUserCourses(
      institutionId,
      this.props.user
    );
    this.dataListRender(user_courses);
  };

  dataListRender(array) {
    this.setState({
      items: array,
      isLoading: false,
    });
  }

  async getUserCourses(institutionId, userId) {
    let array = [];
    try {
      array = await getCourses(institutionId, userId);
    } catch (err) {
      enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
    } finally {
      return array;
    }
  }

  onCourseSelected = (course) => {
    this.setState({ course, courseSelected: !this.state.courseSelected });
  };

  onCourseSelection(subject, course) {
    if (subject) this.props.updateSubject(subject);
    if (course) this.props.updateCourse(course);
    this.props.history.push(HOME_URL);
  }

  render() {
    const { items, isLoading } = this.state;
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
                    {items.map((course) => {
                      return (
                        <CursoCardListView
                          key={course.id}
                          item={course}
                          collect={collect}
                          onClick={(e) => this.onCourseSelected(course)}
                        />
                      );
                    })}{' '}
                  </Row>
                  <Collapse isOpen={this.state.courseSelected}>
                    <h2 className="display-5">
                      <IntlMessages id="materia.selection" />
                    </h2>
                    <hr className="my-4" />
                    <Row>
                      {this.state.course &&
                        this.state.course.subjects.map((subject) => {
                          return (
                            <CursoCardListView
                              key={subject.id}
                              item={subject}
                              collect={collect}
                              onClick={(e) =>
                                this.onCourseSelection(
                                  subject,
                                  this.state.course
                                )
                              }
                            />
                          );
                        })}{' '}
                    </Row>
                  </Collapse>
                </Jumbotron>
              </CardBody>
            </Card>
          </Colxx>
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

export default connect(mapStateToProps, { updateSubject, updateCourse })(
  withRouter(Course)
);
