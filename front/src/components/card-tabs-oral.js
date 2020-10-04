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
  Badge,
  TabPane,
  Button,
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

class CardTabsOral extends Component {
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

  render() {
    const { item, rol } = this.props;
    const { data, entregada } = item;
    return (
      <Row lg="12" className="tab-card-evaluaciones">
        <Colxx xxs="3">
          <Row lg="12">
            <Colxx xxs="12" xs="12" lg="12" id={item.id}>
              <Card className={`mb-4 ${this.state.focused ? 'focused' : ''}`}>
                <CardHeader className="pl-0 pr-0">
                  <Nav tabs className=" card-header-tabs ml-0 mr-0">
                    <NavItem
                      className={
                        rol === ROLES.Docente
                          ? 'w-50 text-center'
                          : 'w-100 text-center'
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
                    {rol === ROLES.Docente && (
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
                    )}
                  </Nav>
                </CardHeader>
                <TabContent activeTab={this.state.activeSecondTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Colxx sm="3">
                        <CardBody>
                          <Row>
                            <CardTitle className="mb-4">
                              {data.nombre}
                            </CardTitle>
                            <Colxx xxs="12" xs="4" lg="4">
                              <div className="dropdown-calendar flex">
                                <p>Fecha y Hora de Evaluación&nbsp;</p>
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
                        </CardBody>
                      </Colxx>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Colxx sm="3">
                        <CardBody></CardBody>
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
