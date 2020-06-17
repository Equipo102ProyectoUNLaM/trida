import React, { Component } from "react";
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
} from "reactstrap";
import { NavLink } from "react-router-dom";



import classnames from "classnames";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx } from "../../components/common/CustomBootstrap";

class TabClassesMenu extends Component {
  constructor(props) {
    super(props);

    this.toggleFirstTab = this.toggleFirstTab.bind(this);
    this.toggleSecondTab = this.toggleSecondTab.bind(this);
    this.state = {
      activeFirstTab: "1",
      activeSecondTab: "1"
    };
  }

  toggleFirstTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeFirstTab: tab
      });
    }
  }
  toggleSecondTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeSecondTab: tab
      });
    }
  }
  render() {
    return (
      <Row lg="12">
        <Colxx xxs="12" xs="12" lg="12">
          <Row lg="12">
            <Colxx xxs="12" xs="12" lg="12">
              <Card className="mb-4">
                <CardHeader className="pl-0 pr-0"> 
                  <Nav tabs className=" card-header-tabs  ml-0 mr-0">
                    <NavItem className="w-25 text-center">
                      <NavLink
                        to="#" location={{}}
                        className={classnames({
                          active: this.state.activeSecondTab === "1",
                          "nav-link": true
                        })}
                        onClick={() => {
                          this.toggleSecondTab("1");
                        }}
                      >
                        Aula Virtual
                      </NavLink>
                    </NavItem>                 
                    <NavItem className="w-25 text-center">
                      <NavLink
                        to="#" location={{}}
                        className={classnames({
                          active: this.state.activeSecondTab === "2",
                          "nav-link": true
                        })}
                        onClick={() => {
                          this.toggleSecondTab("2");
                        }}
                      >
                        Preguntas
                      </NavLink>
                    </NavItem>
                    <NavItem className="w-25 text-center">
                      <NavLink
                        to="#" location={{}}
                        className={classnames({
                          active: this.state.activeSecondTab === "3",
                          "nav-link": true
                        })}
                        onClick={() => {
                          this.toggleSecondTab("3");
                        }}
                      >
                        Respuestas
                      </NavLink>
                    </NavItem>
                    <NavItem className="w-25 text-center">
                      <NavLink
                        to="#" location={{}}
                        className={classnames({
                          active: this.state.activeSecondTab === "4",
                          "nav-link": true
                        })}
                        onClick={() => {
                          this.toggleSecondTab("4");
                        }}
                      >
                        Asistencia
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>

                <TabContent activeTab={this.state.activeSecondTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Colxx sm="12" lg="12">
                        <CardBody>
                          <CardTitle className="mb-4">
                            Jitsi + chat + lanzar preguntas
                          </CardTitle>
                        </CardBody>
                      </Colxx>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Colxx sm="12" lg="12">
                        <CardBody>
                          <CardTitle className="mb-4">
                          Crear preguntas
                          </CardTitle>
                        </CardBody>
                      </Colxx>
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <Row>
                      <Colxx sm="12" lg="12">
                        <CardBody>
                          <CardTitle className="mb-4">
                          Resultados de preguntas
                          </CardTitle>
                        </CardBody>
                      </Colxx>
                    </Row>
                  </TabPane>
                  <TabPane tabId="4">
                    <Row>
                      <Colxx sm="12" lg="12">
                        <CardBody>
                          <CardTitle className="mb-4">
                            Asistencia
                          </CardTitle>
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

export default TabClassesMenu;
