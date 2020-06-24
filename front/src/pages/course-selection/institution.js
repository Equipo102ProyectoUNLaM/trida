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
                                            <Button onClick={this.goToApp} color="primary" className="mb-2">
                                                <IntlMessages id="menu.my-classes" />
                                            </Button>
                                        </Colxx>
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