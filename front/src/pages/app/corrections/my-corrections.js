import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";

export default class MyCorrections extends Component {
    render() {
        return (
            <Fragment>
            <Row>
              <Colxx xxs="12">
                <h1><IntlMessages id="menu.my-corrections"/></h1>
                <Separator className="mb-5" />
              </Colxx>
            </Row>
          </Fragment>
        )
    }
}