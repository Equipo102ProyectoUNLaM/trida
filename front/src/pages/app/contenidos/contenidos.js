import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Contents from "../../../containers/dashboards/contents"

export default class Contenidos extends Component {
    render() {
        return (
            <Fragment>
            <Row>
              <Colxx xxs="12">
                <h1><IntlMessages id="menu.my-contents"/></h1>
                <Separator className="mb-5" />
              </Colxx>
            </Row>
            <Row>
              <Contents/>
            </Row>
          </Fragment>
        )
    }
}
