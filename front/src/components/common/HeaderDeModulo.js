import React, { Component } from "react";
import {
  Row,
  Button,
} from "reactstrap";
import { injectIntl } from "react-intl";

import { Colxx, Separator } from "./CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";

class HeaderDeModulo extends Component {
  constructor(props) {
    super();
    this.state = {
      dropdownSplitOpen: false,
      displayOptionsIsOpen: false
    };
  }

  toggleSplit =()=> {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }));
  }

  render() {
    const {
      heading,
      toggleModal,
      buttonText
    } = this.props;

    return (
      <Row>
        <Colxx xxs="12">
          <div className="mb-2">
            <h1>
              <IntlMessages id={heading} />
            </h1>
            <>
            {buttonText && (
            <div className="text-zero top-right-button-container">
              <Button
                color="primary"
                size="lg"
                className="top-right-button"
                onClick={()=>toggleModal()}
                >
                 <IntlMessages id={buttonText} />
              </Button>
              {"  "}
            </div>
            )}
            </>
          </div>
          <Separator className="mb-5" />
        </Colxx>
      </Row>
    );
  }
}

export default injectIntl(HeaderDeModulo);
