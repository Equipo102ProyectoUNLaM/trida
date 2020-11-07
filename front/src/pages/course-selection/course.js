import React, { Fragment, Component } from 'react';
import { Collapse, Button, Row, Card, CardBody, Jumbotron } from 'reactstrap';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx } from '../../components/common/CustomBootstrap';
import { withRouter } from 'react-router-dom';
import { getCourses } from 'helpers/Firebase-user';
import { enviarNotificacionError } from 'helpers/Utils-ui';
import { connect } from 'react-redux';
import { updateSubject, updateCourse } from 'redux/actions';

const HOME_URL = '/app/home';

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getCourses();
  }

  getCourses = async () => {
    const { institutionId } = this.props.match.params;
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

  toggle = (i) => {
    var prevState = this.state.items;
    prevState[i].collapsed = !prevState[i].collapsed;
    this.setState({
      items: prevState,
    });
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
                    {items.map((course, index) => {
                      return (
                        <Row
                          key={index}
                          className="mb-4 ml-0 mr-0 course-row"
                          xxs="12"
                          xs="12"
                          lg="12"
                        >
                          <Colxx xxs="12" xs="12" lg="12">
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

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;

  return {
    user,
  };
};

export default connect(mapStateToProps, { updateSubject, updateCourse })(
  withRouter(Course)
);
