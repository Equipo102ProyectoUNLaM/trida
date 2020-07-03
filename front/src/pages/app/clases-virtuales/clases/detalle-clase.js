import React, { Component, Fragment } from 'react';
import { Colxx } from '../../../../components/common/CustomBootstrap';
import TabClassesMenu from '../../../../containers/ui/TabClassesMenu';
import { Row } from 'reactstrap';

export default class DetalleClase extends Component {
  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <h1>
              <i className="simple-icon-notebook heading-icon" />{' '}
              <span className="align-middle d-inline-block pt-1">Clase 1</span>
            </h1>
          </Colxx>
        </Row>
        <TabClassesMenu />
      </Fragment>
    );
  }
}
