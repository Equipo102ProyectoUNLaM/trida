import React, { Fragment } from "react";
import { Row, Card, CardBody, Jumbotron, Button } from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx } from "../../components/common/CustomBootstrap";
import { withRouter } from 'react-router-dom';

const HOME_URL = '/app/home';

const Institution = ({history}) => {

        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12" className="mb-4">
                        <Card>
                            <CardBody>
                                <Jumbotron>
                                    <h1 className="display-4">
                                        <IntlMessages id="jumbotron.hello-world" />
                                    </h1>
                                    <p className="lead">
                                        <IntlMessages id="jumbotron.lead" />
                                    </p>
                                    <hr className="my-4" />
                                    <p>
                                        <IntlMessages id="jumbotron.lead-detail" />
                                    </p>
                                    <p className="lead mb-0">
                                        <Colxx xxs="12" className="mb-4">
                                            <Button onClick={() => history.push(HOME_URL)} color="primary" className="mb-2">
                                                <IntlMessages id="menu.my-classes" />
                                            </Button>
                                        </Colxx>
                                    </p>
                                </Jumbotron>
                            </CardBody>
                        </Card>
                    </Colxx>
                </Row>
            </Fragment>
        )
    };

    export default withRouter(Institution);
