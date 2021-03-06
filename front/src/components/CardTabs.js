import React, { Component, Fragment } from 'react';
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Nav,
  NavItem,
  TabContent,
  Badge,
  TabPane,
  Button,
  Alert,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { editDocument } from 'helpers/Firebase-db';
import ROLES from 'constants/roles';
import classnames from 'classnames';
import { Colxx } from 'components/common/CustomBootstrap';
import Calendario from './common/Calendario';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getDateTimeStringFromDate } from 'helpers/Utils';
import { timeStamp } from 'helpers/Firebase';
import { isMobile } from 'react-device-detect';
import AccionesMobile from 'components/common/AccionesMobile';

class CardTabs extends Component {
  constructor(props) {
    super(props);
    this.toggleFirstTab = this.toggleFirstTab.bind(this);
    this.toggleSecondTab = this.toggleSecondTab.bind(this);
    this.state = {
      activeFirstTab: '1',
      activeSecondTab: '1',
      modalMakeOpen: false,
      focused: window.location.hash.replace('#', '') === this.props.item.id,
    };
  }

  componentDidMount() {
    const { focused } = this.state;
    if (focused) {
      const el = document.querySelector(`[id='${this.props.item.id}']`);
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
  }

  toggleFirstTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeFirstTab: tab,
      });
    }
  }
  toggleSecondTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeSecondTab: tab,
      });
    }
  }

  handleClickEdit = () => {
    this.props.onEdit(this.props.item.id);
  };

  handleClickVistaPrevia = () => {
    this.props.onPreview(this.props.item.id);
  };

  handleClickDelete = () => {
    this.props.onDelete(this.props.item.id);
  };

  handleClickExport = () => {
    this.props.onExport(this.props.item.id);
  };

  handleClickChangeFinalDate = async (date) => {
    if (date) {
      const obj = {
        fecha_finalizacion: timeStamp.fromDate(new Date(date)),
      };
      await editDocument(
        'evaluaciones',
        this.props.item.id,
        obj,
        'Evaluación editada'
      );
      this.props.updateEvaluaciones(this.props.materiaId);
    }
  };

  handleClickChangePublicationDate = async (date) => {
    if (date) {
      const obj = {
        fecha_publicacion: timeStamp.fromDate(new Date(date)),
      };
      await editDocument(
        'evaluaciones',
        this.props.item.id,
        obj,
        'Evaluación editada'
      );
      this.props.updateEvaluaciones(this.props.materiaId);
    }
  };

  handleClickMake = () => {
    this.props.onMake(this.props.item);
  };

  render() {
    const { item, rol } = this.props;
    const { data, entregada } = item;
    const rolDocente = rol !== ROLES.Alumno;
    return (
      <Row lg="12" className="tab-card-evaluaciones">
        <Colxx xxs="12">
          <Row lg="12">
            <Colxx xxs="12" xs="12" lg="12" id={item.id}>
              <Card className={`mb-4 ${this.state.focused ? 'focused' : ''}`}>
                <CardHeader className="pl-0 pr-0">
                  <Nav tabs className=" card-header-tabs ml-0 mr-0">
                    <NavItem
                      className={
                        rolDocente ? 'w-50 text-center' : 'w-100 text-center'
                      }
                    >
                      <NavLink
                        to="#"
                        location={{}}
                        className={classnames({
                          active: this.state.activeSecondTab === '1',
                          'nav-link': true,
                        })}
                        onClick={() => {
                          this.toggleSecondTab('1');
                        }}
                      >
                        Evaluación
                      </NavLink>
                    </NavItem>
                    {rolDocente && (
                      <NavItem className="w-50 text-center">
                        <NavLink
                          to="#"
                          location={{}}
                          className={classnames({
                            active: this.state.activeSecondTab === '2',
                            'nav-link': true,
                          })}
                          onClick={() => {
                            this.toggleSecondTab('2');
                          }}
                        >
                          Ejercicios
                        </NavLink>
                      </NavItem>
                    )}
                  </Nav>
                </CardHeader>

                <TabContent activeTab={this.state.activeSecondTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Colxx sm="12">
                        <CardBody>
                          <Row>
                            <Colxx xxs="12" xs="8" lg="8">
                              <CardTitle className="mb-4">
                                <h2>{data.base.nombre}</h2>
                              </CardTitle>
                              {data.base.descripcion && (
                                <p className="mb-4 text-muted">
                                  {data.base.descripcion}
                                </p>
                              )}
                              {!data.base.descripcion && (
                                <p className="mb-4 text-muted">
                                  Sin descripción
                                </p>
                              )}
                            </Colxx>
                            <Colxx xxs="12" xs="4" lg="4">
                              <div className="dropdown-calendar flex">
                                <p>
                                  {isMobile
                                    ? 'Publicación'
                                    : 'Fecha y Hora de Publicación'}{' '}
                                  &nbsp;
                                </p>
                                {rolDocente && !this.props.isOldTest && (
                                  <Calendario
                                    handleClick={
                                      this.handleClickChangePublicationDate
                                    }
                                    text="Modificar fecha de publicación"
                                    evalCalendar={true}
                                    dateFormat={'DD/MM/YYYY - HH:mm'}
                                    timeCaption="Hora"
                                    timeIntervals={15}
                                    timeFormat={'HH:mm'}
                                  />
                                )}
                                {data.base.fecha_publicacion && (
                                  <p className="mb-4">
                                    {getDateTimeStringFromDate(
                                      data.base.fecha_publicacion
                                    )}
                                  </p>
                                )}
                                {!data.base.fecha_publicacion && (
                                  <p className="mb-4">Sin fecha</p>
                                )}
                              </div>
                              <div className="dropdown-calendar flex">
                                <p>
                                  {isMobile
                                    ? 'Finalización'
                                    : 'Fecha y Hora de Finalización'}{' '}
                                  &nbsp;
                                </p>
                                {rolDocente && !this.props.isOldTest && (
                                  <Calendario
                                    handleClick={
                                      this.handleClickChangeFinalDate
                                    }
                                    text="Modificar fecha de evaluación"
                                    evalCalendar={true}
                                    dateFormat={'DD/MM/YYYY - HH:mm'}
                                    timeCaption="Hora"
                                    timeIntervals={15}
                                    timeFormat={'HH:mm'}
                                  />
                                )}
                                {data.base.fecha_finalizacion && (
                                  <p className="mb-4">
                                    {getDateTimeStringFromDate(
                                      data.base.fecha_finalizacion
                                    )}
                                  </p>
                                )}
                                {!data.base.fecha_finalizacion && (
                                  <p className="mb-4">Sin fecha</p>
                                )}
                              </div>
                            </Colxx>
                          </Row>
                          <Row className="button-group mb-4">
                            {isMobile ? (
                              <Fragment>
                                {!rolDocente &&
                                !entregada &&
                                !this.props.isOldTest ? (
                                  <Button
                                    outline
                                    onClick={this.handleClickMake}
                                    size="sm"
                                    color="primary"
                                    className="button mt-2"
                                  >
                                    Realizar Evaluación
                                  </Button>
                                ) : (
                                  <AccionesMobile
                                    leftIcon={
                                      rolDocente &&
                                      !this.props.isOldTest &&
                                      data.base.fecha_publicacion.toDate() >
                                        new Date()
                                        ? 'glyph-icon simple-icon-pencil'
                                        : null
                                    }
                                    leftIconToggle={this.handleClickEdit}
                                    middleIcon={
                                      rolDocente &&
                                      !this.props.isOldTest &&
                                      data.base.fecha_publicacion.toDate() >
                                        new Date()
                                        ? 'glyph-icon simple-icon-trash'
                                        : null
                                    }
                                    middleIconToggle={this.handleClickDelete}
                                    rightIcon={
                                      rolDocente
                                        ? 'glyph-icon simple-icon-share-alt'
                                        : null
                                    }
                                    rightIconToggle={this.handleClickExport}
                                  />
                                )}
                              </Fragment>
                            ) : (
                              <Fragment>
                                {rolDocente &&
                                  !this.props.isOldTest &&
                                  data.base.fecha_publicacion.toDate() >
                                    new Date() && (
                                    <Button
                                      outline
                                      onClick={this.handleClickEdit}
                                      size="sm"
                                      color="primary"
                                      className="button mt-2"
                                    >
                                      Editar Evaluación
                                    </Button>
                                  )}
                                {rolDocente &&
                                  !this.props.isOldTest &&
                                  data.base.fecha_publicacion.toDate() <
                                    new Date() && (
                                    <div className="alert-evaluaciones">
                                      <i className="iconsminds-information" />
                                      <span color="warning">
                                        La evaluación no puede editarse ni
                                        borrarse porque está en curso!
                                      </span>
                                    </div>
                                  )}
                                {rolDocente &&
                                  !this.props.isOldTest &&
                                  data.base.fecha_publicacion.toDate() >
                                    new Date() && (
                                    <Button
                                      outline
                                      onClick={this.handleClickDelete}
                                      size="sm"
                                      color="primary"
                                      className="button mt-2"
                                    >
                                      Borrar Evaluación
                                    </Button>
                                  )}
                                {rolDocente && (
                                  <Button
                                    outline
                                    onClick={this.handleClickExport}
                                    size="sm"
                                    color="primary"
                                    className="button mt-2"
                                  >
                                    Exportar Evaluación
                                  </Button>
                                )}
                                {!rolDocente &&
                                  !entregada &&
                                  !this.props.isOldTest && (
                                    <Button
                                      outline
                                      onClick={this.handleClickMake}
                                      size="sm"
                                      color="primary"
                                      className="button mt-2"
                                    >
                                      Realizar Evaluación
                                    </Button>
                                  )}
                              </Fragment>
                            )}
                            {!rolDocente && entregada && (
                              <div>
                                <Badge color="primary" pill className="mb-1">
                                  ENTREGADA
                                </Badge>
                              </div>
                            )}
                            {!rolDocente && !entregada && this.props.isOldTest && (
                              <div>
                                <Badge color="danger" pill className="mb-1">
                                  NO ENTREGADA
                                </Badge>
                              </div>
                            )}
                          </Row>
                        </CardBody>
                      </Colxx>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Colxx sm="12">
                        <CardBody>
                          {data.subcollections.length > 0 && (
                            <ol>
                              {data.subcollections.map((scol) => (
                                <div
                                  className="ejerciciosRow"
                                  key={scol.id + 'ej'}
                                >
                                  <li className="ejerciciosItem">
                                    {scol.data.nombre}
                                  </li>
                                </div>
                              ))}
                            </ol>
                          )}
                          <Row className="button-group w-100">
                            <Button
                              outline
                              size="sm"
                              color="primary mt-2"
                              onClick={this.handleClickVistaPrevia}
                            >
                              Vista Previa de Evaluación
                            </Button>
                          </Row>
                        </CardBody>
                      </Colxx>
                    </Row>
                  </TabPane>
                </TabContent>
              </Card>
            </Colxx>
          </Row>
        </Colxx>
      </Row>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { userData } = authUser;
  const { rol } = userData;

  return { rol };
};

export default injectIntl(connect(mapStateToProps)(CardTabs));
