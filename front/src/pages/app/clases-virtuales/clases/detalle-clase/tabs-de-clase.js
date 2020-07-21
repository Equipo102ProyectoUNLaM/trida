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
import Moment from 'moment';
import 'react-keyed-file-browser/dist/react-keyed-file-browser.css';
import ModalAsociarContenidos from './modal-asociar-contenidos';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';

class TabsDeClase extends Component {
  constructor(props) {
    super(props);

    this.toggleFirstTab = this.toggleFirstTab.bind(this);
    this.toggleSecondTab = this.toggleSecondTab.bind(this);
    this.state = {
      activeFirstTab: '1',
      activeSecondTab: '1',
      modalContenidosOpen: false,
      modalDeleteOpen: false,
      files: [],
      isLoading: false,
      contenidoRef: '',
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
    this.setState(
      {
        modalContenidosOpen: !this.state.modalContenidosOpen,
        isLoading: true,
      },
      () => {
        if (this.state.modalContenidosOpen) this.dataListRenderer();
      }
    );
  };

  async dataListRenderer() {
    var array = [];
    try {
      //Obtenemos la referencia de la carpeta que quiero listar (La de la materia)
      var listRef = storage.ref(this.props.idMateria);
      // Obtenemos las referencias de carpetas y archivos
      await listRef.listAll().then(async (result) => {
        //Carpetas
        for (const folderRef of result.prefixes) {
          //Listamos archivos de cada carpeta
          var subFolderElements = await this.listFolderItems(
            folderRef,
            this.props.idMateria
          );
          array = array.concat(subFolderElements);
        }
        //Archivos
        for (const res of result.items) {
          await res.getMetadata().then(async (metadata) => {
            await res.getDownloadURL().then(async (url) => {
              var obj = {
                key: metadata.fullPath.replace(this.props.idMateria + '/', ''),
                modified: Moment(metadata.updated),
                size: metadata.size,
                url: url,
              };
              array.push(obj);
            });
          });
        }
      });
    } catch (err) {
      console.log('Error getting documents', err);
    } finally {
      this.setState({
        files: array,
        isLoading: false,
      });
    }
  }

  async listFolderItems(ref, subjectId) {
    var array = [];
    try {
      await ref.listAll().then(async (result) => {
        //Carpetas
        for (const folderRef of result.prefixes) {
          var subFolderElements = await this.listFolderItems(
            folderRef,
            subjectId
          );
          array = array.concat(subFolderElements);
        }
        //Archivos
        for (const res of result.items) {
          await res.getMetadata().then(async (metadata) => {
            await res.getDownloadURL().then(async (url) => {
              var obj = {
                key: metadata.fullPath.replace(subjectId + '/', ''),
                modified: Moment(metadata.updated),
                size: metadata.size,
                url: url,
              };
              array.push(obj);
            });
          });
        }
      });
    } catch (err) {
      console.log('Error getting documents', err);
    } finally {
      return array;
    }
  }

  toggleDeleteModal = () => {
    this.setState({
      modalDeleteOpen: !this.state.modalDeleteOpen,
    });
  };

  onDelete = (ref) => {
    this.setState({
      contenidoRef: ref,
    });
    this.toggleDeleteModal();
  };

  unlinkContenido = async () => {
    try {
      var obj = await getDocument(`clases/${this.props.idClase}`);
      const { data } = obj;
      var arrayFiltrado = data.contenidos.filter(
        (element) => element !== this.state.contenidoRef
      );
      await editDocument(
        'clases',
        this.props.idClase,
        { contenidos: arrayFiltrado },
        'Contenido'
      );
    } catch (err) {
      console.log('Error', err);
    }
    this.toggleDeleteModal();
    this.props.updateContenidos();
  };

  handleFileChecked = () => {
    console.log('test');
  };

  render() {
    const {
      idSala,
      contenidos,
      idClase,
      idMateria,
      updateContenidos,
    } = this.props;
    const {
      modalContenidosOpen,
      isLoading,
      files,
      modalDeleteOpen,
    } = this.state;

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
                            <p className="mb-4">No hay contenidos asociados</p>
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
                          {modalDeleteOpen && (
                            <ModalConfirmacion
                              texto="¿Está seguro de que desea quitar el contenido?"
                              titulo="Desvincular Contenido"
                              buttonPrimary="Aceptar"
                              buttonSecondary="Cancelar"
                              toggle={this.toggleDeleteModal}
                              isOpen={modalDeleteOpen}
                              onConfirm={this.unlinkContenido}
                            />
                          )}
                          <Row className="button-group">
                            <Button
                              onClick={this.toggleModalContenidos}
                              color="primary"
                              size="lg"
                              className="button"
                            >
                              Asociar Contenidos
                            </Button>
                          </Row>
                          {modalContenidosOpen && (
                            <ModalGrande
                              modalOpen={modalContenidosOpen}
                              toggleModal={this.toggleModalContenidos}
                              text="Asociar Contenidos"
                            >
                              <ModalAsociarContenidos
                                files={files}
                                contenidos={contenidos}
                                isLoading={isLoading}
                                updateContenidos={updateContenidos}
                                idClase={idClase}
                                idMateria={idMateria}
                                toggleModalContenidos={
                                  this.toggleModalContenidos
                                }
                              />
                            </ModalGrande>
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
