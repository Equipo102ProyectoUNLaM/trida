import React, { Component } from 'react';
import classnames from 'classnames';
import { Row, Card, CardBody, Collapse, Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { desencriptarTexto } from 'handlers/DecryptionHandler';
import { isEmpty, getDateTimeStringFromDate } from 'helpers/Utils';

class TabsDeFormales extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: false,
      collapseSent: false,
      accordion: [],
      accordionSent: [],
      data: [],
      dataSent: [],
      focused: window.location.hash
        ? window.location.hash.replace('#', '')
        : '',
    };
  }

  componentDidMount() {
    const { focused } = this.state;
    if (focused) {
      const el = document.querySelector(`[id='${focused}']`);
      console.log(el);
      const headerOffset = 200;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      setTimeout(() => {
        this.setState({ focused: null });
      }, 3000);
    }

    let accordionData = [];
    let accordionDataSent = [];

    this.props.itemsReceive.forEach(() => {
      accordionData.push(false);
    });
    this.props.itemsSent.forEach(() => {
      accordionDataSent.push(false);
    });
    this.setState({
      collapse: false,
      accordion: accordionData,
      data: this.props.itemsReceive,
      collapseSent: false,
      accordionSent: accordionDataSent,
      dataSent: this.props.itemsSent,
    });
  }

  toggleAccordion = (tab) => {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    this.setState({
      accordion: state,
    });
  };

  toggleAccordionSent = (tab) => {
    const prevState = this.state.accordionSent;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    this.setState({
      accordionSent: state,
    });
  };

  render() {
    const { itemsSent, itemsReceive, rolDirectivo } = this.props;
    return (
      <>
        {rolDirectivo && (
          <div className="display-column">
            <span className="subtitle">Comunicaciones Enviadas</span>
            <Row>
              <Colxx sm="12" lg="12" className="pl-0">
                <CardBody>
                  <Row className="mt-2">
                    <Colxx xxs="12" className="mb-4">
                      <>
                        {isEmpty(itemsSent) && (
                          <span>No hay comunicaciones enviadas</span>
                        )}
                        {itemsSent.map((item, index) => {
                          return (
                            <Card
                              className="d-flex mb-3"
                              key={index}
                              id={item.id}
                            >
                              <div className="d-flex flex-grow-1 min-width-zero">
                                <Button
                                  color="link"
                                  className="card-body padding-1 btn-empty btn-link list-item-heading text-left text-one"
                                  onClick={() =>
                                    this.toggleAccordionSent(index)
                                  }
                                  aria-expanded={
                                    this.state.accordionSent[index]
                                  }
                                >
                                  <div className="display-column">
                                    <Row className="row-space-between-pl-1">
                                      <div>
                                        <span className="subtitle">
                                          Enviado a:{' '}
                                        </span>
                                        <span className="subtext">
                                          {item.destinatarios}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="subtitle">
                                          Fecha:{' '}
                                        </span>
                                        <span className="subtext">
                                          {item.fecha_creacion}
                                        </span>
                                      </div>
                                    </Row>
                                    <div>
                                      <span className="subtitle">Asunto: </span>
                                      <span className="subtext">
                                        {item.asunto}
                                      </span>
                                    </div>
                                  </div>
                                </Button>
                              </div>
                              <Collapse
                                isOpen={this.state.accordionSent[index]}
                              >
                                <div
                                  className="card-body accordion-content pt-0"
                                  dangerouslySetInnerHTML={{
                                    __html: desencriptarTexto(item.contenido),
                                  }}
                                />
                              </Collapse>
                            </Card>
                          );
                        })}
                      </>
                    </Colxx>
                  </Row>
                </CardBody>
              </Colxx>
            </Row>
            <Separator className="mb-4" />
            <span className="subtitle">Comunicaciones Recibidas</span>
            <Row>
              <Colxx sm="12" lg="12">
                <CardBody>
                  <Row className="mt-2">
                    <Colxx xxs="12" className="mb-4">
                      <>
                        {isEmpty(itemsReceive) && (
                          <span>No hay comunicaciones recibidas</span>
                        )}
                        {itemsReceive.map((item, index) => {
                          return (
                            <div className="d-flex mb-3" key={index}>
                              <div className="d-flex flex-grow-1 min-width-zero">
                                <Button
                                  color="link"
                                  className="card-body padding-1 btn-empty btn-link list-item-heading text-left text-one"
                                  onClick={() => this.toggleAccordion(index)}
                                  aria-expanded={this.state.accordion[index]}
                                >
                                  <div className="display-column">
                                    <Row className="row-space-between-pl-1">
                                      <div>
                                        <span className="subtitle">
                                          Enviado por:{' '}
                                        </span>
                                        <span className="subtext">
                                          {item.remitente}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="subtitle">
                                          Fecha:{' '}
                                        </span>
                                        <span className="subtext">
                                          {getDateTimeStringFromDate(
                                            item.fecha_creacion
                                          )}
                                        </span>
                                      </div>
                                    </Row>
                                    Asunto: {item.asunto}
                                  </div>
                                </Button>
                              </div>
                              <Collapse isOpen={this.state.accordion[index]}>
                                <div
                                  className="card-body accordion-content pt-0"
                                  dangerouslySetInnerHTML={{
                                    __html: desencriptarTexto(item.contenido),
                                  }}
                                />
                              </Collapse>
                            </div>
                          );
                        })}
                      </>
                    </Colxx>
                  </Row>
                </CardBody>
              </Colxx>
            </Row>
          </div>
        )}
        {!rolDirectivo && (
          <>
            <Row className="mt-2">
              <Colxx xxs="12" className="mb-4">
                <>
                  {isEmpty(itemsReceive) && (
                    <span>No hay comunicaciones recibidas</span>
                  )}
                  {itemsReceive.map((item, index) => {
                    return (
                      <Card
                        className={classnames('d-flex mb-3', {
                          focused: item.id === this.state.focused,
                        })}
                        key={index}
                        id={item.id}
                      >
                        <div className="d-flex flex-grow-1 min-width-zero">
                          <Button
                            color="link"
                            className="card-body padding-1 btn-empty btn-link list-item-heading text-left text-one"
                            onClick={() => this.toggleAccordion(index)}
                            aria-expanded={this.state.accordion[index]}
                          >
                            <div className="display-column">
                              <Row className="row-space-between-pl-1">
                                <div>
                                  <span className="subtitle">
                                    Enviado por:{' '}
                                  </span>
                                  <span className="subtext">
                                    {item.remitente}
                                  </span>
                                </div>
                                <div>
                                  <span className="subtitle">Fecha: </span>
                                  <span className="subtext">
                                    {item.fecha_creacion}
                                  </span>
                                </div>
                              </Row>
                              <div>
                                <span className="subtitle">Asunto: </span>
                                <span className="subtext">{item.asunto}</span>
                              </div>
                            </div>
                          </Button>
                        </div>
                        <Collapse isOpen={this.state.accordion[index]}>
                          <div
                            className="card-body accordion-content pt-0"
                            dangerouslySetInnerHTML={{
                              __html: desencriptarTexto(item.contenido),
                            }}
                          />
                        </Collapse>
                      </Card>
                    );
                  })}
                </>
              </Colxx>
            </Row>
          </>
        )}
      </>
    );
  }
}

export default withRouter(TabsDeFormales);
