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
import moment from 'moment';
import DataListView from 'containers/pages/DataListView';
import classnames from 'classnames';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import PaginaVideollamada from './pagina-videollamada';
import PaginaAsistencia from './pagina-asistencia';
import { storage } from 'helpers/Firebase';
import {
  getDocument,
  editDocument,
  getDocumentWithSubCollection,
} from 'helpers/Firebase-db';
import { isEmpty } from 'helpers/Utils';
import { enviarNotificacionError } from 'helpers/Utils-ui';
import ModalGrande from 'containers/pages/ModalGrande';
import Moment from 'moment';
import ModalAsociarContenidos from './modal-asociar-contenidos';
import ModalAsociarLinks from './modal-asociar-links';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import ModalCrearPreguntas from './modal-crear-preguntas';
import ModalVistaPreviaPreguntas from '../preguntas-clase/vista-previa-preguntas';
import ROLES from 'constants/roles';
import { desencriptarEjercicios } from 'helpers/DecryptionHandler';
import RespuestasAPreguntas from './respuestas-a-preguntas';
import { isMobile } from 'react-device-detect';

class TabsDeClase extends Component {
  constructor(props) {
    super(props);

    this.toggleSecondTab = this.toggleSecondTab.bind(this);
    this.state = {
      activeSecondTab: '1',
      modalContenidosOpen: false,
      modalLinksOpen: false,
      modalDeleteOpen: false,
      files: [],
      linksDeClase: [],
      isLoading: true,
      contenidoRef: '',
      propsContenidos: [],
      preguntasDeClase: [],
      modalPreguntasOpen: false,
      modalPreviewOpen: false,
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
    this.getLinksDeClase();
    this.dataListRenderer();
    this.getPreguntasDeClase();
  }

  getAsistenciaDeClase = async () => {
    this.setState({ isLoading: true });
    const { data } = await getDocument(`clases/${this.props.idClase}`);
    const { asistencia } = data;
    const asistenciaAlumno = asistencia
      ? asistencia.filter((elem) => elem.rol === 2)
      : [];
    this.setState({ isLoading: false, asistencia: asistenciaAlumno });
  };

  getLinksDeClase = async () => {
    const { data } = await getDocument(`clases/${this.props.idClase}`);
    this.setState({
      linksDeClase: data.links,
    });
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

  toggleModalLinks = () => {
    this.setState({
      modalLinksOpen: !this.state.modalLinksOpen,
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
          const metadata = await res.getMetadata();
          const url = await res.getDownloadURL();
          const obj = {
            key: metadata.fullPath.replace(
              'materias/' + this.props.idMateria + '/contenidos/',
              ''
            ),
            modified: Moment(metadata.updated),
            size: metadata.size,
            url,
          };
          array.push(obj);
        }
      });
    } catch (err) {
      enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
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
          const metadata = await res.getMetadata();
          const url = await res.getDownloadURL();
          var obj = {
            key: metadata.fullPath.replace('materias/' + subjectId + '/', ''),
            modified: Moment(metadata.updated),
            size: metadata.size,
            url,
          };
          array.push(obj);
        }
      });
    } catch (err) {
      enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
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
        return null;
      });

      const contenidos = updatedContents.map(
        (nombre) =>
          'gs://trida-7f28f.appspot.com/materias/' +
          this.props.idMateria +
          '/contenidos/' +
          nombre
      );

      let contenidosConUrl = [];

      for (const contenido of contenidos) {
        const gsReference = storage.refFromURL(contenido);
        const url = await gsReference.getDownloadURL();
        contenidosConUrl.push({
          nombre: contenido,
          name: gsReference.name,
          url,
        });
      }

      this.setState(
        {
          propsContenidos: contenidosConUrl,
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

  toggleModalPreguntas = () => {
    this.setState({
      modalPreguntasOpen: !this.state.modalPreguntasOpen,
    });
  };

  togglePreviewModal = () => {
    this.setState({
      modalPreviewOpen: !this.state.modalPreviewOpen,
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
        'Clase editada'
      );
    } catch (err) {
      enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
    }
    this.toggleDeleteModal();
    this.props.updateContenidos();
  };

  getPreguntasDeClase = async () => {
    this.setState({ isLoading: true });

    //Traigo de la DB las preguntas encriptadas
    const claseConPreguntas = await getDocumentWithSubCollection(
      `clases/${this.props.idClase}`,
      'preguntas'
    );

    const { subCollection } = claseConPreguntas;

    //Desencripto las preguntas
    const sinRespuesta = false;
    const preguntasDesencriptadas = desencriptarEjercicios(
      subCollection,
      sinRespuesta
    );

    //Ordeno preguntas por número
    this.setState({
      preguntasDeClase: preguntasDesencriptadas.sort(
        (a, b) => a.data.numero - b.data.numero
      ),
      isLoading: false,
    });
  };

  isEditarDisabled = () => {
    return (
      moment(this.props.fechaClase.toDate()).diff(moment(), 'minutes') < 10
    );
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
      nombre,
    } = this.props;
    const {
      modalContenidosOpen,
      modalLinksOpen,
      isLoading,
      files,
      modalDeleteOpen,
      propsContenidos,
      preguntasDeClase,
      modalPreguntasOpen,
      modalPreviewOpen,
      asistencia,
      linksDeClase,
    } = this.state;
    const rolDocente = rol !== ROLES.Alumno;
    const rolAlumno = rol === ROLES.Alumno;
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
                        rolDocente ? 'w-20 text-center' : 'w-33 text-center'
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
                        {isMobile && (
                          <h1 className="ml-2 mr-2">
                            <div
                              className={'glyph-icon iconsminds-video-tripod'}
                            />
                          </h1>
                        )}
                        {!isMobile && 'Aula Virtual'}
                      </NavLink>
                    </NavItem>
                    <NavItem
                      className={
                        rolDocente ? 'w-20 text-center' : 'w-33 text-center'
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
                        {isMobile && (
                          <h1 className="ml-2 mr-2">
                            <div
                              className={'glyph-icon iconsminds-folder-cloud'}
                            />
                          </h1>
                        )}
                        {!isMobile && 'Contenidos'}
                      </NavLink>
                    </NavItem>
                    {rolDocente && (
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
                          {isMobile && (
                            <h1 className="ml-2 mr-2">
                              <div
                                className={
                                  'glyph-icon iconsminds-speach-bubble-asking'
                                }
                              />
                            </h1>
                          )}
                          {!isMobile && 'Preguntas'}
                        </NavLink>
                      </NavItem>
                    )}
                    <NavItem
                      className={
                        rolDocente ? 'w-20 text-center' : 'w-33 text-center'
                      }
                    >
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
                        {isMobile && (
                          <h1 className="ml-2 mr-2">
                            <div
                              className={
                                'glyph-icon iconsminds-speach-bubble-dialog'
                              }
                            />
                          </h1>
                        )}
                        {!isMobile && 'Respuestas'}
                      </NavLink>
                    </NavItem>
                    {rolDocente && (
                      <NavItem className="w-20 text-center">
                        <NavLink
                          to="#5"
                          location={{}}
                          className={classnames({
                            active: this.state.activeSecondTab === '5',
                            'nav-link': true,
                          })}
                          onClick={() => {
                            this.getAsistenciaDeClase();
                            this.toggleSecondTab('5');
                          }}
                        >
                          {isMobile && (
                            <h1 className="ml-2 mr-2">
                              <div
                                className={'glyph-icon iconsminds-male-female'}
                              />
                            </h1>
                          )}
                          {!isMobile && 'Asistencia'}
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
                              preguntas={preguntasDeClase}
                              subject={nombre}
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
                                  return (
                                    <DataListView
                                      key={contenido.nombre}
                                      id={contenido.nombre}
                                      title={contenido.name}
                                      onDelete={
                                        rolDocente ? this.onDelete : null
                                      }
                                      url={contenido.url}
                                      navTo="#"
                                    />
                                  );
                                })}{' '}
                              </Row>
                            ))}
                          {modalDeleteOpen && (
                            <ModalConfirmacion
                              texto="¿Estás seguro de quitar el contenido?"
                              titulo="Desvincular Contenido"
                              buttonPrimary="Aceptar"
                              buttonSecondary="Cancelar"
                              toggle={this.toggleDeleteModal}
                              isOpen={modalDeleteOpen}
                              onConfirm={this.unlinkContenido}
                            />
                          )}
                          {rolDocente && (
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
                          <Separator className="mb-3 mt-3" />
                          <CardTitle className="mb-4">
                            Links Asociados
                          </CardTitle>
                          {!isLoading &&
                            (isEmpty(linksDeClase) ? (
                              <p className="mb-4">No hay links asociados</p>
                            ) : (
                              linksDeClase.map((link) => {
                                return (
                                  <Row
                                    key={link.link}
                                    className="lista-links-clase"
                                  >
                                    <a
                                      className="link-clase"
                                      id={link.link}
                                      href={link.link}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      {link.descripcion} <br /> {link.link}
                                    </a>
                                  </Row>
                                );
                              })
                            ))}
                          {rolDocente && (
                            <Row className="button-group">
                              <Button
                                onClick={this.toggleModalLinks}
                                color="primary"
                                size="lg"
                                className="button"
                              >
                                {isEmpty(linksDeClase)
                                  ? 'Asociar Links'
                                  : 'Editar Links'}
                              </Button>
                            </Row>
                          )}
                          {modalLinksOpen && (
                            <ModalGrande
                              modalOpen={modalLinksOpen}
                              toggleModal={this.toggleModalLinks}
                              text="Asociar Links"
                            >
                              <ModalAsociarLinks
                                links={linksDeClase}
                                isLoading={isLoading}
                                idClase={idClase}
                                idMateria={idMateria}
                                toggleModalLinks={this.toggleModalLinks}
                                updateLinks={this.getLinksDeClase}
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
                            Preguntas de la clase
                          </CardTitle>
                          {isLoading && <div className="cover-spin" />}
                          {!isLoading &&
                            (isEmpty(preguntasDeClase) ? (
                              <p className="mb-4">
                                No hay preguntas creadas para esta clase
                              </p>
                            ) : (
                              <Row>
                                {preguntasDeClase.map((pregunta) => {
                                  const consignaPregunta =
                                    pregunta.data.consigna;

                                  return (
                                    <DataListView
                                      key={pregunta.id}
                                      id={pregunta.id}
                                      title={consignaPregunta}
                                      sonPreguntas={true}
                                    />
                                  );
                                })}
                              </Row>
                            ))}
                          {rolDocente && (
                            <Row className="button-group">
                              {!isEmpty(preguntasDeClase) && (
                                <Button
                                  outline
                                  className="mt-1"
                                  size="lg"
                                  color="secondary"
                                  onClick={this.togglePreviewModal}
                                >
                                  Vista Previa de Preguntas
                                </Button>
                              )}
                              <Button
                                onClick={this.toggleModalPreguntas}
                                color="primary"
                                size="lg"
                                className="button mt-1"
                                disabled={this.isEditarDisabled()}
                              >
                                {isEmpty(preguntasDeClase)
                                  ? 'Crear Preguntas'
                                  : 'Editar Preguntas'}
                              </Button>
                            </Row>
                          )}
                          {modalPreguntasOpen && (
                            <ModalCrearPreguntas
                              isLoading={isLoading}
                              idClase={idClase}
                              modalOpen={modalPreguntasOpen}
                              preguntas={preguntasDeClase}
                              toggleModalPreguntas={this.toggleModalPreguntas}
                              updatePreguntas={this.getPreguntasDeClase}
                            />
                          )}
                          {modalPreviewOpen && (
                            <ModalVistaPreviaPreguntas
                              toggle={this.togglePreviewModal}
                              isOpen={modalPreviewOpen}
                              preguntas={preguntasDeClase}
                            />
                          )}
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
                          <RespuestasAPreguntas
                            isLoading={true}
                            idClase={idClase}
                            rolDocente={rolDocente}
                            rolAlumno={rolAlumno}
                            idMateria={idMateria}
                          />
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
