import React, { Component } from 'react';
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Button,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { editDocument, getUsernameById } from 'helpers/Firebase-db';
import ROLES from 'constants/roles';
import classnames from 'classnames';
import { Colxx } from 'components/common/CustomBootstrap';
import Calendario from './common/Calendario';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getDateTimeStringFromDate, isEmpty } from 'helpers/Utils';
import { timeStamp } from 'helpers/Firebase';

class CardTabsOral extends Component {
  constructor(props) {
    super(props);
    this.toggleFirstTab = this.toggleFirstTab.bind(this);
    this.toggleSecondTab = this.toggleSecondTab.bind(this);
    this.state = {
      activeFirstTab: '1',
      activeSecondTab: '1',
      modalMakeOpen: false,
      integrantes: [],
      focused: window.location.hash.replace('#', '') === this.props.item.id,
    };
  }

  async componentDidMount() {
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

    this.setState({
      integrantes: await this.getNameOfReceivers(this.props.item),
    });
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

  handleClickChangeFinalDate = async (date) => {
    if (date) {
      const obj = {
        fecha_evaluacion: timeStamp.fromDate(new Date(date)),
      };
      await editDocument(
        'evaluacionesOrales',
        this.props.item.id,
        obj,
        'Evaluación editada'
      );
      this.props.updateEvaluaciones(this.props.materiaId);
    }
  };

  handleClickEdit = () => {
    this.props.onEdit(this.props.item);
  };

  handleClickDelete = () => {
    this.props.onDelete(this.props.item.id);
  };

  handleClickMake = () => {
    this.props.onMake(this.props.item);
  };

  getNameOfReceivers = async (evaluacion) => {
    let nombreIntegrantes = [];
    if (evaluacion.data.integrantes.length > 0) {
      evaluacion.data.integrantes.forEach(async (integrante) => {
        const name = await getUsernameById(integrante);
        nombreIntegrantes.push(name);
      });
    }
    return nombreIntegrantes;
  };

  render() {
    const { item, rol } = this.props;
    const { data } = item;
    const { integrantes } = this.state;
    return (
      <Row lg="12" className="tab-card-evaluaciones">
        <Colxx xxs="3">
          <Row lg="12">
            <Colxx xxs="12" xs="12" lg="12" id={item.id}>
              <Card className={`mb-4 ${this.state.focused ? 'focused' : ''}`}>
                <CardHeader className="pl-0 pr-0">
                  <Nav tabs className=" card-header-tabs ml-0 mr-0">
                    <NavItem className={'w-50 text-center'}>
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
                        Integrantes
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>
                <TabContent activeTab={this.state.activeSecondTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Colxx sm="12">
                        <CardBody>
                          <Row>
                            <CardTitle className="mb-3 ml-1">
                              {data.nombre}
                            </CardTitle>
                            <Colxx xxs="12" xs="12" lg="12">
                              <p>Fecha y Hora de Evaluación</p>
                              <div className="dropdown-calendar flex ml-0">
                                {rol === ROLES.Docente &&
                                  !this.props.isOldTest && (
                                    <Calendario
                                      handleClick={
                                        this.handleClickChangeFinalDate
                                      }
                                      text="Modificar fecha de evaluación"
                                      evalCalendar={true}
                                      dateFormat={'DD/MM/YYYY - HH:mm'}
                                      timeCaption="Hora"
                                      timeIntervals={60}
                                      timeFormat={'HH:mm'}
                                      className="ml-0"
                                    />
                                  )}
                                {
                                  <p className="mb-4">
                                    {getDateTimeStringFromDate(
                                      data.fecha_evaluacion
                                    )}
                                  </p>
                                }
                              </div>
                            </Colxx>
                          </Row>
                          <Row className="button-group">
                            {!this.props.isOldTest && (
                              <Button
                                outline
                                onClick={this.handleClickMake}
                                size="sm"
                                color="primary"
                                className="button"
                              >
                                Realizar Evaluación
                              </Button>
                            )}
                            {rol === ROLES.Docente && !this.props.isOldTest && (
                              <div
                                className="glyph-icon simple-icon-pencil edit-action-icon ml-1"
                                onClick={this.handleClickEdit}
                              />
                            )}
                            {rol === ROLES.Docente && !this.props.isOldTest && (
                              <div
                                className="glyph-icon simple-icon-trash delete-action-icon"
                                onClick={this.handleClickDelete}
                              />
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
                          {!isEmpty(integrantes) &&
                            this.state.integrantes.map((integrante) => {
                              return (
                                <li key={integrante}>
                                  <strong>{integrante}</strong>
                                </li>
                              );
                            })}
                          {isEmpty(integrantes) && (
                            <Row>
                              <span>La evaluación no tiene integrantes</span>
                            </Row>
                          )}
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

export default injectIntl(connect(mapStateToProps)(CardTabsOral));
