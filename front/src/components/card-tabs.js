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
import { editDocument } from 'helpers/Firebase-db';

import classnames from 'classnames';
import { Colxx } from 'components/common/CustomBootstrap';
import Calendario from './common/Calendario';

class CardTabs extends Component {
  constructor(props) {
    super(props);

    this.toggleFirstTab = this.toggleFirstTab.bind(this);
    this.toggleSecondTab = this.toggleSecondTab.bind(this);
    this.state = {
      activeFirstTab: '1',
      activeSecondTab: '1',
    };
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

  handleClickDelete = () => {
    this.props.onDelete(this.props.item.id);
  };

  handleClickChangeDate = async (date) => {
    if (date) {
      const obj = { fecha: date.format('YYYY-MM-DD') };
      await editDocument('evaluaciones', this.props.item.id, obj, 'Evaluación');
    }
  };

  render() {
    const { item, navTo } = this.props;
    const { data } = item;
    return (
      <Row>
        <Colxx xxs="12">
          <Row>
            <Colxx xxs="12" xs="6" lg="3">
              <Card className="tab-card">
                <CardHeader className="pl-0 pr-0">
                  <Nav tabs className=" card-header-tabs ml-0 mr-0">
                    <NavItem className="w-50 text-center">
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
                        Ejercicios
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>

                <TabContent activeTab={this.state.activeSecondTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Colxx sm="12">
                        <CardBody>
                          <CardTitle className="mb-4">{data.nombre}</CardTitle>
                          {data.descripcion && (
                            <p className="mb-4">{data.descripcion}</p>
                          )}
                          {!data.descripcion && (
                            <p className="mb-4">Sin descripción</p>
                          )}
                          <Row className="dropdown-calendar">
                            <Calendario
                              handleClick={this.handleClickChangeDate}
                              text="Modificar fecha de evaluación"
                              evalCalendar={true}
                            />
                            {data.fecha && <p className="mb-4">{data.fecha}</p>}
                            {!data.fecha && <p className="mb-4">Sin fecha</p>}
                          </Row>
                          <Row className="button-group">
                            <Button
                              outline
                              onClick={this.handleClickEdit}
                              size="sm"
                              color="primary"
                              className="button"
                            >
                              Editar
                            </Button>
                            <Button
                              outline
                              onClick={this.handleClickDelete}
                              size="sm"
                              color="primary"
                              className="button"
                            >
                              Borrar
                            </Button>
                          </Row>
                        </CardBody>
                      </Colxx>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Colxx sm="12">
                        <CardBody>
                          <p>Traer ejercicios asociados a la eval</p>
                          <Button
                            outline
                            size="sm"
                            color="primary"
                            onClick={this.handleClickEdit}
                          >
                            Editar
                          </Button>
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

export default CardTabs;
