import React, { Component } from 'react';
import { Row, Card } from 'reactstrap';
import { Colxx } from '../components/common/CustomBootstrap';

class NoMobile extends Component {
  render() {
    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="form-side margin-auto">
              <h1 className="font-weight-bold center">
                ¡Ups! Esta funcionalidad no está disponible en dispositivos
                móviles
              </h1>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}
export default NoMobile;
