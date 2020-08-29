import React, { Component, Fragment } from 'react';
import { Row, Card, CardTitle, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Colxx } from '../components/common/CustomBootstrap';
import IntlMessages from '../helpers/IntlMessages';

class Error extends Component {
  componentDidMount() {
    document.body.classList.add('background');
  }
  componentWillUnmount() {
    document.body.classList.remove('background');
  }
  render() {
    return (
      <Fragment>
        <div className="fixed-background" />
        <main className="main-app">
          <div className="container">
            <Row className="h-100">
              <Colxx xxs="12" md="10" className="mx-auto my-auto">
                <Card className="auth-card">
                  <div className="position-relative image-side ">
                    <NavLink to={`/`} className="white">
                      <span className="logo-single" />
                    </NavLink>
                  </div>
                  <div className="form-side">
                    <CardTitle className="mb-4">
                      <IntlMessages id="pages.error-construccion-title" />
                    </CardTitle>
                    <p className="display-1 font-weight-bold mb-5">
                      <i className="iconsminds-engineering" />
                    </p>
                    <Row className="button-group">
                      <Button
                        href="/"
                        color="primary"
                        className="btn-shadow"
                        size="lg"
                      >
                        <IntlMessages id="pages.go-back-home" />
                      </Button>
                    </Row>
                  </div>
                </Card>
              </Colxx>
            </Row>
          </div>
        </main>
      </Fragment>
    );
  }
}
export default Error;
