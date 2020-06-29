import React, { Component, Fragment } from "react";
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import IntlMessages from "../helpers/IntlMessages";
import { Colxx } from "./common/CustomBootstrap";

export default class ModalUi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalRight: false,
      modalLarge: false,
      modalSmall: false,
      modalLong: false,
      modalBack: false,
      backdrop: true
    };
  }
  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  toggleLarge = () => {
    this.setState(prevState => ({
      modalLarge: !prevState.modalLarge
    }));
  };


  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Card className="mb-4">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="modal.basic" />
                </CardTitle>
                <div>
                  <Modal
                    isOpen={this.state.modalLarge}
                    size="lg"
                    toggle={this.toggleLarge}
                  >
                    <ModalHeader toggle={this.toggleLarge}>
                      Modal title
                    </ModalHeader>
                    <ModalBody>
                      Contenido de clase
                    </ModalBody>
                  </Modal>
                </div>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
