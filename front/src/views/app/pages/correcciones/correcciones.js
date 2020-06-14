import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import IntlMessages from "../../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../../containers/navs/Breadcrumb";

export default class Correcciones extends Component {
    render() {
        return (
            <Fragment>
            <Row>
              <Colxx xxs="12">
                <h1><IntlMessages id="menu.correcciones"/></h1>
                <Separator className="mb-5" />
              </Colxx>
            </Row>
          </Fragment>
        )
    }
}
