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

import classnames from 'classnames';
import { Colxx } from 'components/common/CustomBootstrap';

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

  render() {
    const { item, navTo } = this.props;
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
                          <CardTitle className="mb-4">{item.nombre}</CardTitle>
                          {item.description && (
                            <p className="mb-4">{item.description}</p>
                          )}
                          {!item.description && (
                            <p className="mb-4">Sin descripción</p>
                          )}
                          {item.fecha && <p className="mb-4">{item.fecha}</p>}
                          {!item.fecha && <p className="mb-4">Sin fecha</p>}
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
                          <p>Traer ejercicios</p>
                          <Button outline size="sm" color="primary">
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
