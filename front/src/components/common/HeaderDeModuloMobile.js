import React, { Component } from 'react';
import { Row, Button, ButtonGroup } from 'reactstrap';
import { injectIntl } from 'react-intl';

import { Colxx, Separator } from './CustomBootstrap';
import IntlMessages from '../../helpers/IntlMessages';
import Breadcrumb from 'containers/navegacion/Breadcrumb';

class HeaderDeModuloMobile extends Component {
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
      toggleIcon,
      iconText,
      secondaryToggle,
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
              <Separator className="mb-5" />
              <Row className="button-group mb-4">
                <ButtonGroup className="m-auto">
                  {secondaryButtonText && (
                    <Button
                      style={{ height: '3rem' }}
                      color="primary"
                      onClick={() => secondaryToggle()}
                    >
                      <IntlMessages id={secondaryButtonText} />
                    </Button>
                  )}
                  {iconText && (
                    <Button
                      color="primary"
                      style={{ height: '3rem' }}
                      className="border-left"
                      onClick={() => toggleIcon()}
                    >
                      <div style={{ fontSize: '1rem' }} className={iconText} />
                    </Button>
                  )}
                </ButtonGroup>
              </Row>
            </>
            <></>
          </div>
        </Colxx>
      </Row>
    );
  }
}

export default injectIntl(HeaderDeModuloMobile);
