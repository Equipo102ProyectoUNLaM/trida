import React, { Component } from 'react';
import { Row, Button } from 'reactstrap';
import { injectIntl } from 'react-intl';

import { Colxx, Separator } from './CustomBootstrap';
import IntlMessages from '../../helpers/IntlMessages';
import Breadcrumb from 'containers/navegacion/Breadcrumb';

class HeaderDeModulo extends Component {
  constructor(props) {
    super();
    this.state = {
      dropdownSplitOpen: false,
      displayOptionsIsOpen: false,
    };
  }

  toggleSplit = () => {
    this.setState((prevState) => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen,
    }));
  };

  render() {
    const {
      heading,
      toggleModal,
      buttonText,
      secondaryToggleModal,
      secondaryButtonText,
      match,
      breadcrumb,
      text,
    } = this.props;
    return (
      <Row>
        <Colxx xxs="12">
          <div className="mb-2" style={{ display: 'flow-root' }}>
            {heading && (
              <h1>
                <IntlMessages id={heading} />
              </h1>
            )}
            {text && <h1>{text}</h1>}
            {breadcrumb && <Breadcrumb match={match} />}
            <>
              {secondaryButtonText && (
                <div className="text-zero top-right-button-container">
                  <Button
                    color="primary"
                    size="lg"
                    className="top-right-button ml-1 mr-1 mt-1"
                    onClick={() => secondaryToggleModal()}
                  >
                    <IntlMessages id={secondaryButtonText} />
                  </Button>
                  {'  '}
                </div>
              )}
            </>
            <>
              {buttonText && (
                <div className="text-zero top-right-button-container">
                  <Button
                    color="primary"
                    size="lg"
                    className="top-right-button ml-1 mr-1 mt-1"
                    onClick={() => toggleModal()}
                  >
                    <IntlMessages id={buttonText} />
                  </Button>
                  {'  '}
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
