import React, { Fragment, Component } from "react";
import {
    Collapse,
    Button,
    Row,
    Card,
    CardSubtitle,
    CardBody,
    CardTitle,
    Jumbotron
} from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx } from "../../components/common/CustomBootstrap";
import { withRouter } from 'react-router-dom';
import { courses } from './../../data/courses';

const HOME_URL = '/app/home';

class Course extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: courses
        }
    }

    toggle = (i) => {
        var prevState = this.state.items;
        prevState[i].collapsed = !prevState[i].collapsed;
        this.setState({
            items: prevState
        });
    };

    render() {
        const { history } = this.props;
        return (
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
                                                    <Colxx >
                                                        <Button color="primary" onClick={() => this.toggle(index)} block className="mb-2">
                                                            {course.name}
                                                        </Button>
                                                        <Collapse isOpen={course.collapsed}>
                                                            {course.subjects.map((subject, i) => {
                                                                return (
                                                                    <Row key={i + "div"} >
                                                                            <h4 className="subject" onClick={() => history.push(HOME_URL)} >{subject.name} </h4>
                                                                    </Row>
                                                                );
                                                            })}
                                                        </Collapse>
                                                    </Colxx>
                                                </Row>
                                            );
                                        })}{" "}

                                    </Row>
                                </Jumbotron>
                            </CardBody>
                        </Card>
                    </Colxx>
                </Row>
            </Fragment>);
    }
}
export default withRouter(Course);