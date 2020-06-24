import React, { Component, Fragment } from "react";
import { Row, Button, Card, CardBody, Jumbotron } from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { Redirect, NavLink, Route } from "react-router-dom";
import { Formik, Form, Field } from "formik";


export default class Institution extends Component {

    constructor(props) {
        super(props);
        // Este enlace es necesario para hacer que `this` funcione en el callback
        this.goToApp = this.goToApp.bind(this);
    }



    goToApp() {
        return (<Route to="/app" />);
    }

    render() {
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
                                            <Button onClick={this.goToApp} color="primary" className="mb-2">
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
            //     <Row className="h-100">
            //     <Colxx xxs="12" md="10" className="mx-auto my-auto">
            //       <Card className="auth-card">

            //         <div className="form-side">
            //           <NavLink to={`/`} className="white">
            //             <span className="logo-single" />
            //           </NavLink>
            //           <CardTitle className="mb-4">
            //             <IntlMessages id="user.login-title" />
            //           </CardTitle>
            //           <Colxx xxs="12" className="mb-4">
            //                     <Button onClick={this.goToApp} color="primary" className="mb-2">
            //                         <IntlMessages id="menu.my-classes" />
            //                     </Button>
            //                 </Colxx>
            //         </div>
            //       </Card>
            //     </Colxx>
            //   </Row>
        )
    }
}