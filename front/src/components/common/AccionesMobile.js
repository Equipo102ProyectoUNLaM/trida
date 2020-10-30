import React, { Component } from 'react';
import { Row, Button, ButtonGroup } from 'reactstrap';
import { injectIntl } from 'react-intl';

import { Colxx } from './CustomBootstrap';

class AccionesMobile extends Component {
  constructor(props) {
    super();
    this.state = {
      dropdownSplitOpen: false,
      displayOptionsIsOpen: false,
    };
  }

  render() {
    const {
      leftIcon,
      leftIconToggle,
      middleIcon,
      middleIconToggle,
      rightIcon,
      rightIconCalendar,
      rightIconToggle,
      lastIcon,
      lastIconToggle,
    } = this.props;
    return (
      <Row className="m-auto" style={{ textAlign: 'center' }}>
        <Colxx xxs="12">
          <ButtonGroup className="m-auto">
            {leftIcon && (
              <Button
                color="primary"
                style={{ height: '3rem' }}
                onClick={() => leftIconToggle()}
              >
                <div style={{ fontSize: '1rem' }} className={leftIcon} />
              </Button>
            )}
            {middleIcon && (
              <Button
                color="primary"
                style={{ height: '3rem' }}
                className={leftIcon ? 'border-left' : ''}
                onClick={() => middleIconToggle()}
              >
                <div style={{ fontSize: '1rem' }} className={middleIcon} />
              </Button>
            )}
            {rightIcon && (
              <Button
                color="primary"
                style={{ height: '3rem' }}
                className={middleIcon || leftIcon ? 'border-left' : ''}
                onClick={() => rightIconToggle()}
              >
                <div style={{ fontSize: '1rem' }} className={rightIcon} />
              </Button>
            )}
            {rightIconCalendar && (
              <Button
                color="primary"
                style={{ height: '3rem' }}
                className={
                  middleIcon || leftIcon || rightIcon ? 'border-left' : ''
                }
              >
                {rightIconCalendar}
              </Button>
            )}
            {lastIcon && (
              <Button
                color="primary"
                style={{ height: '3rem' }}
                className={
                  middleIcon || leftIcon || rightIcon || rightIconCalendar
                    ? 'border-left'
                    : ''
                }
                onClick={() => lastIconToggle()}
              >
                <div style={{ fontSize: '1rem' }} className={lastIcon} />
              </Button>
            )}
          </ButtonGroup>
        </Colxx>
      </Row>
    );
  }
}

export default injectIntl(AccionesMobile);
