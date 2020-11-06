import React, { Fragment } from 'react';
import Excalidraw from 'excalidraw';
import { Button, Row, Card } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import { isMobile } from 'react-device-detect';

import 'excalidraw/dist/excalidraw.min.css';
import { HmacSHA1 } from 'crypto-js';
const pizarronURI = '/pizarron';

class Pizarron extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 800,
    };

    this.boardParentEl = React.createRef();
  }

  componentDidMount() {
    this.getParentDimensions();
  }

  getParentDimensions = () => {
    if (this.props.fullscreen) {
      return this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (this.boardParentEl.current) {
      this.setState({
        width: this.boardParentEl.current.clientWidth,
        height: this.boardParentEl.current.clientHeight,
      });
    }
  };

  onChange = (elements, state) => {
    return;
  };

  onUsernameChange = (username) => {
    return;
  };

  abrirPizarron = () => {
    const strWindowFeatures = 'location=yes, scrollbars=yes, status=yes';
    window.open(pizarronURI, '_blank', strWindowFeatures);
  };

  render() {
    const { width, height } = this.state;
    const { fullscreen } = this.props;
    const options = { zenModeEnabled: false, viewBackgroundColor: '#ffffff' };

    return (
      <>
        {isMobile && (
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
        )}
        {!isMobile && (
          <Fragment>
            {!fullscreen && (
              <Row className="button-group open-in-new-window-row">
                <Button
                  className="button"
                  color="primary"
                  size="lg"
                  onClick={this.abrirPizarron}
                >
                  <IntlMessages id="pizarron.abrir-nueva-ventana" />
                </Button>
              </Row>
            )}
            <div className="board" ref={this.boardParentEl}>
              <Excalidraw
                width={width}
                height={height}
                onResize={this.getParentDimensions}
                onChange={this.onChange}
                options={options}
                user={{ name: 'Excalidraw User' }}
                onUsernameChange={this.onUsernameChange}
              />
            </div>
          </Fragment>
        )}
      </>
    );
  }
}
export default injectIntl(Pizarron);
