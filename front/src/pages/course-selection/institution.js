import React, { Fragment } from "react";
import { Row, Card, CardBody, Jumbotron, Button } from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx } from "../../components/common/CustomBootstrap";
import { withRouter } from 'react-router-dom';

const HOME_URL = '/app/home';

const Institution = ({history}) => {

        return (
            <Fragment>
                <Row className="course-row-container">
                    <Colxx xxs="12" className="mb-4 course-col-container">
                        <Card className="course-card-center">
                            <CardBody>
                                <Jumbotron>
                                    <h2 className="display-5">
                                        <IntlMessages id="institution.selection" />
                                    </h2>
                                    <hr className="my-4" />
                                        <Colxx xxs="12" className="mb-4">
                                            <Button onClick={() => history.push(HOME_URL)} color="primary" className="mb-2">
                                                <IntlMessages id="menu.my-classes" />
                                            </Button>
                                        </Colxx>
                                </Jumbotron>
                            </CardBody>
                        </Card>
                    </Colxx>
                </Row>
            </Fragment>
        )
    };

    export default withRouter(Institution);
