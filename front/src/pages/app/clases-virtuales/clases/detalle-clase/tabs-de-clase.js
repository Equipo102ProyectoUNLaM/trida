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
import PaginaAsistencia from './pagina-asistencia';
import { storage } from 'helpers/Firebase';
import { getDocument, editDocument } from 'helpers/Firebase-db';
import { isEmpty } from 'helpers/Utils';
import ModalGrande from 'containers/pages/ModalGrande';
import Moment from 'moment';
import ModalAsociarContenidos from './modal-asociar-contenidos';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import ROLES from 'constants/roles';

class TabsDeClase extends Component {
  constructor(props) {
    super(props);

    this.toggleSecondTab = this.toggleSecondTab.bind(this);

    this.state = {
      activeSecondTab: '1',
      modalContenidosOpen: false,
      modalDeleteOpen: false,
      files: [],
      isLoading: true,
      contenidoRef: '',
      propsContenidos: [],
      asistencia: [],
    };
  }

  componentDidMount() {
    const { hash } = this.props.history.location;

    if (hash) {
      this.setState({
        activeSecondTab: hash.split('')[1],
      });
    }
    this.getAsistenciaDeClase();
    this.dataListRenderer();
  }

  componentDidUpdate() {
    this.getAsistenciaDeClase();
  }

  getAsistenciaDeClase = async () => {
    const { data } = await getDocument(`clases/${this.props.idClase}`);
    const { asistencia } = data;
    this.setState({ asistencia });
  };

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

  async dataListRenderer() {
    var array = [];
    try {
      //Obtenemos la referencia de la carpeta que quiero listar (La de la materia)
      var listRef = storage.ref(
        'materias/' + this.props.idMateria + '/contenidos'
      );
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
                key: metadata.fullPath.replace(
                  'materias/' + this.props.idMateria + '/contenidos/',
                  ''
                ),
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
      });
      await this.matchFilesWithContents();
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
                key: metadata.fullPath.replace(
                  'materias/' + subjectId + '/',
                  ''
                ),
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

  matchFilesWithContents = async () => {
    let storageFiles = [...this.state.files];

    if (this.props.contenidos) {
      const propsContenidos = this.props.contenidos.map((contenido) => {
        const paths = contenido.split('/');
        return paths[paths.length - 1];
      });

      const updatedContents = propsContenidos.filter((nombre) => {
        const foundFile = storageFiles.find((file) => nombre === file.key);
        if (!isEmpty(foundFile)) {
          return foundFile.key;
        }
      });

      const contenidos = updatedContents.map(
        (nombre) =>
          'gs://trida-7f28f.appspot.com/materias/' +
          this.props.idMateria +
          '/contenidos/' +
          nombre
      );

      this.setState(
        {
          propsContenidos: contenidos,
          isLoading: false,
        },
        async () =>
          await editDocument('clases', this.props.idClase, {
            contenidos: contenidos,
          })
      );
    }
  };

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
        'Clase'
      );
    } catch (err) {
      console.log('Error', err);
    }
    this.toggleDeleteModal();
    this.props.updateContenidos();
  };

  render() {
    const {
      idSala,
      password,
      contenidos,
      idClase,
      idMateria,
      updateContenidos,
      rol,
    } = this.props;
    const {
      modalContenidosOpen,
      isLoading,
      files,
      modalDeleteOpen,
      propsContenidos,
      asistencia,
    } = this.state;

    return (
      <Row lg="12">
        <Colxx xxs="12" xs="12" lg="12">
          <Row lg="12">
            <Colxx xxs="12" xs="12" lg="12">
              <Card className="mb-4">
                <CardHeader className="pl-0 pr-0">
                  <Nav tabs className=" card-header-tabs  ml-0 mr-0">
                    <NavItem
                      className={
                        rol === ROLES.Docente
                          ? 'w-20 text-center'
                          : 'w-50 text-center'
                      }
                    >
                      <NavLink
                        to="#1"
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
                    <NavItem
                      className={
                        rol === ROLES.Docente
                          ? 'w-20 text-center'
                          : 'w-50 text-center'
                      }
                    >
                      <NavLink
                        to="#2"
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
                    {rol === ROLES.Docente && (
                      <NavItem className="w-20 text-center">
                        <NavLink
                          to="#3"
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
                    )}
                    {rol === ROLES.Docente && (
                      <NavItem className="w-20 text-center">
                        <NavLink
                          to="#4"
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
                    )}
                    {rol === ROLES.Docente && (
                      <NavItem className="w-20 text-center">
                        <NavLink
                          to="#5"
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
                    )}
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
                            <PaginaVideollamada
                              idSala={idSala}
                              idClase={idClase}
                              password={password}
                            />
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
                          {isLoading && <div className="cover-spin" />}
                          {!isLoading &&
                            (isEmpty(propsContenidos) ? (
                              <p className="mb-4">
                                No hay contenidos asociados
                              </p>
                            ) : (
                              <Row>
                                {propsContenidos.map((contenido) => {
                                  var gsReference = storage.refFromURL(
                                    contenido
                                  );
                                  return (
                                    <DataListView
                                      key={contenido}
                                      id={contenido}
                                      title={gsReference.name}
                                      onDelete={
                                        rol === ROLES.Docente
                                          ? this.onDelete
                                          : null
                                      }
                                      navTo="#"
                                    />
                                  );
                                })}{' '}
                              </Row>
                            ))}
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
                          {rol === ROLES.Docente && (
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
                          )}
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
                          <PaginaAsistencia asistencia={asistencia} />
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
