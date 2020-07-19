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
import { NavLink, withRouter } from 'react-router-dom';
import DataListView from 'containers/pages/DataListView';
import classnames from 'classnames';
import { Colxx } from 'components/common/CustomBootstrap';
import PaginaVideollamada from './pagina-videollamada';
import { storage } from 'helpers/Firebase';
import { getDocument, editDocument } from 'helpers/Firebase-db';
import { isEmpty } from 'helpers/Utils';
import ModalGrande from 'containers/pages/ModalGrande';

class TabsDeClase extends Component {
  constructor(props) {
    super(props);

    this.toggleFirstTab = this.toggleFirstTab.bind(this);
    this.toggleSecondTab = this.toggleSecondTab.bind(this);
    this.state = {
      activeFirstTab: '1',
      activeSecondTab: '1',
      modalContenidosOpen: false,
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

  toggleModalContenidos = () => {
    this.setState({
      modalContenidosOpen: !this.state.modalContenidosOpen,
    });
  };

  onDelete = async (ref) => {
    var gsReference = storage.refFromURL(ref);
    try {
      await gsReference.delete();
      var obj = await getDocument(`clases/${this.props.idClase}`);
      const { data } = obj;
      var arrayFiltrado = data.contenidos.filter((element) => element !== ref);
      await editDocument(
        'clases',
        this.props.idClase,
        { contenidos: arrayFiltrado },
        'Contenido'
      );
    } catch (err) {
      console.log('Error', err);
    }
  };

  getContenidos = async () => {
    var storageRef = await storage.ref();
    var storageMateria = storageRef.child(this.props.idMateria);
    storageMateria
      .listAll()
      .then(function (res) {
        res.prefixes.forEach(function (folderRef) {
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
        });
        res.items.forEach(function (itemRef) {
          // All the items under listRef.
        });
      })
      .catch(function (error) {
        // Uh-oh, an error occurred!
      });
  };

  render() {
    const { idSala, contenidos, idClase } = this.props;
    const { modalContenidosOpen } = this.state;

    return (
      <Row lg="12">
        <Colxx xxs="12" xs="12" lg="12">
          <Row lg="12">
            <Colxx xxs="12" xs="12" lg="12">
              <Card className="mb-4">
                <CardHeader className="pl-0 pr-0">
                  <Nav tabs className=" card-header-tabs  ml-0 mr-0">
                    <NavItem className="w-20 text-center">
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
                        Aula Virtual
                      </NavLink>
                    </NavItem>
                    <NavItem className="w-20 text-center">
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
                        Contenidos
                      </NavLink>
                    </NavItem>
                    <NavItem className="w-20 text-center">
                      <NavLink
                        to="#"
                        location={{}}
                        className={classnames({
                          active: this.state.activeSecondTab === '3',
                          'nav-link': true,
                        })}
                        onClick={() => {
                          this.toggleSecondTab('3');
                        }}
                      >
                        Preguntas
                      </NavLink>
                    </NavItem>
                    <NavItem className="w-20 text-center">
                      <NavLink
                        to="#"
                        location={{}}
                        className={classnames({
                          active: this.state.activeSecondTab === '4',
                          'nav-link': true,
                        })}
                        onClick={() => {
                          this.toggleSecondTab('4');
                        }}
                      >
                        Respuestas
                      </NavLink>
                    </NavItem>
                    <NavItem className="w-20 text-center">
                      <NavLink
                        to="#"
                        location={{}}
                        className={classnames({
                          active: this.state.activeSecondTab === '5',
                          'nav-link': true,
                        })}
                        onClick={() => {
                          this.toggleSecondTab('5');
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
                          {!idSala ? (
                            <CardTitle className="mb-4">
                              No hay videollamada asociada
                            </CardTitle>
                          ) : (
                            <PaginaVideollamada idSala={idSala} />
                          )}
                        </CardBody>
                      </Colxx>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Colxx sm="12" lg="12">
                        <CardBody>
                          <CardTitle className="mb-4">
                            Contenidos Asociados
                          </CardTitle>
                          {isEmpty(contenidos) ? (
                            <>
                              <p className="mb-4">
                                No hay contenidos asociados
                              </p>
                              <Button
                                onClick={this.toggleModalContenidos}
                                className="btn"
                              >
                                Asociar Contenidos
                              </Button>
                              {modalContenidosOpen && (
                                <ModalGrande
                                  modalOpen={modalContenidosOpen}
                                  toggleModal={this.toggleModalContenidos}
                                  text="Asociar Contenidos"
                                >
                                  Lista de contenidos de matereia
                                </ModalGrande>
                              )}
                            </>
                          ) : (
                            <Row>
                              {contenidos.map((contenido) => {
                                var gsReference = storage.refFromURL(contenido);
                                return (
                                  <DataListView
                                    key={contenido}
                                    id={contenido}
                                    title={gsReference.name}
                                    onDelete={this.onDelete}
                                    navTo="#"
                                  />
                                );
                              })}{' '}
                            </Row>
                          )}
                        </CardBody>
                      </Colxx>
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
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
                  <TabPane tabId="4">
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
                  <TabPane tabId="5">
                    <Row>
                      <Colxx sm="12" lg="12">
                        <CardBody>
                          <CardTitle className="mb-4">Asistencia</CardTitle>
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

export default withRouter(TabsDeClase);
