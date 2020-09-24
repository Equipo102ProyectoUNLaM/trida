import React, { Component, Fragment } from 'react';
import { Row, Card, CardTitle, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Colxx } from '../components/common/CustomBootstrap';
import IntlMessages from '../helpers/IntlMessages';

class EnEvaluacion extends Component {
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
                  <div className="form-side margin-auto">
                    <h5 className="font-weight-bold">
                      Estás realizando una evaluación, por lo tanto no podrás
                      navegar por la plataforma.
                    </h5>
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
export default EnEvaluacion;
