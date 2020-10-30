import React, { Fragment } from 'react';
import { Card, Row, Button, Badge } from 'reactstrap';
import classnames from 'classnames';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from '../../components/common/CustomBootstrap';
import { NavLink } from 'react-router-dom';
import Calendario from 'components/common/Calendario';
import { injectIntl } from 'react-intl';
import { editDocument } from 'helpers/Firebase-db';
import ROLES from 'constants/roles';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import AccionesMobile from 'components/common/AccionesMobile';

class DataListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: window.location.hash.replace('#', '') === this.props.id,
    };
  }

  componentDidMount() {
    const { focused } = this.state;
    if (focused) {
      const el = document.querySelector(`[id='${this.props.id}']`);
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

  handleClick = async (date) => {
    if (date) {
      const obj = { fechaVencimiento: date.format('YYYY-MM-DD') };
      if (date) {
        await editDocument('practicas', this.props.id, obj, 'Práctica editada');
      }
    }
  };

  handleClickDelete = () => {
    this.props.onDelete(this.props.id);
  };

  onDownloadFile = (file) => {
    window.open(file, '_blank');
  };

  render() {
    const {
      id,
      idArchivo,
      title,
      text1,
      text2,
      file,
      isSelect,
      collect,
      onEditItem,
      navTo,
      calendario,
      onDelete,
      onUploadFile,
      onCorrection,
      onVerCorrection,
      sonPreguntas,
      estado,
      modalLanzarPreguntas,
      preguntaALanzar,
      onSelectPregunta,
      seLanzo,
      entregada,
      noEntregada,
    } = this.props;
    return (
      <Colxx xxs="12" className="mb-3" id={id}>
        <ContextMenuTrigger id="menu_id" data={id} collect={collect}>
          <Card
            className={classnames('d-flex flex-row', {
              active: isSelect,
              focused: this.state.focused,
            })}
          >
            <div
              className={
                preguntaALanzar === id
                  ? 'pl-2 d-flex flex-grow-1 min-width-zero preguntaSeleccionada'
                  : 'pl-2 d-flex flex-grow-1 min-width-zero'
              }
            >
              {sonPreguntas && (
                <p className=" list-item-heading card-body">{title}</p>
              )}
              {modalLanzarPreguntas && (
                <p
                  className="list-item-heading card-body modalLanzarPreguntas mt-3"
                  onClick={() => onSelectPregunta(id)}
                >
                  {title}
                </p>
              )}
              {modalLanzarPreguntas && seLanzo && (
                <Badge
                  color="danger"
                  pill
                  className="mb-1 position-absolute badge-top-right-1"
                >
                  LANZADA
                </Badge>
              )}
              {!sonPreguntas && !modalLanzarPreguntas && (
                <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                  <NavLink to={`${navTo}`} className="w-90 w-sm-100 active">
                    <p className="list-item-heading mb-1 ">{title}</p>
                    {text1 && (
                      <p className="mb-1 mr-2 text-small w-sm-100 ">{text1}</p>
                    )}
                    {text2 && (
                      <p className="mb-1 text-small w-sm-100 ">{text2}</p>
                    )}
                  </NavLink>
                  <div className="custom-control custom-checkbox pl-1 align-self-center pr-4 practicas-list-label mt-2">
                    <Row className="correcciones-data-list-row">
                      {estado && (
                        <Badge
                          key={id + 'badge'}
                          color="primary"
                          pill
                          className="badge-data-list mt-1 mb-1"
                        >
                          {estado.toUpperCase()}
                        </Badge>
                      )}
                      {file !== undefined && (
                        <Button
                          outline
                          onClick={() => this.onDownloadFile(file)}
                          size="sm"
                          color="primary"
                          className="button datalist-button mt-1 mb-1"
                        >
                          Descargar Práctica
                        </Button>
                      )}
                      {onUploadFile && (
                        <Button
                          outline
                          onClick={() => onUploadFile(id)}
                          size="sm"
                          color="primary"
                          className="button datalist-button mt-1 mb-1"
                        >
                          Subir Práctica
                        </Button>
                      )}
                      {onCorrection && estado === 'No Corregido' && (
                        <Button
                          style={{ width: '7rem' }}
                          outline
                          onClick={() => onCorrection(id, idArchivo, file)}
                          size="sm"
                          color="primary"
                          className="button datalist-button mt-1 mb-1"
                        >
                          Corregir
                        </Button>
                      )}
                      {onVerCorrection && estado === 'Corregido' && (
                        <Button
                          outline
                          onClick={() => onVerCorrection(id, idArchivo)}
                          size="sm"
                          color="primary"
                          className="button datalist-button mt-1 mb-1"
                          disabled={estado === 'Corregido' ? false : true}
                        >
                          Ver Corrección
                        </Button>
                      )}

                      {isMobile ? (
                        <Fragment>
                          <AccionesMobile
                            leftIcon={
                              onEditItem
                                ? 'glyph-icon simple-icon-pencil'
                                : null
                            }
                            leftIconToggle={() => onEditItem(id)}
                            middleIcon={
                              onDelete ? 'glyph-icon simple-icon-trash' : null
                            }
                            middleIconToggle={this.handleClickDelete}
                            rightIconCalendar={
                              calendario ? (
                                <Calendario
                                  handleClick={this.handleClick}
                                  text="Modificar fecha de entrega"
                                  evalCalendar={false}
                                  iconClass="icon-white-calendar"
                                />
                              ) : null
                            }
                          />
                        </Fragment>
                      ) : (
                        <Fragment>
                          {onEditItem && (
                            <div
                              className="glyph-icon simple-icon-pencil edit-action-icon"
                              onClick={() => onEditItem(id)}
                            />
                          )}
                          {onDelete && (
                            <div
                              className="glyph-icon simple-icon-trash delete-action-icon"
                              onClick={this.handleClickDelete}
                            />
                          )}
                          {calendario && (
                            <Calendario
                              handleClick={this.handleClick}
                              text="Modificar fecha de entrega"
                              evalCalendar={false}
                            />
                          )}
                        </Fragment>
                      )}
                    </Row>
                  </div>
                </div>
              )}
            </div>
            {entregada && this.props.rol === ROLES.Alumno && (
              <div className="flex mr-4">
                <Badge color="primary" pill className="margin-auto mb-1">
                  ENTREGADA
                </Badge>
              </div>
            )}
            {noEntregada && this.props.rol === ROLES.Alumno && (
              <div className="flex mr-4">
                <Badge color="danger" pill className="margin-auto mb-1">
                  NO ENTREGADA
                </Badge>
              </div>
            )}
          </Card>
        </ContextMenuTrigger>
      </Colxx>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { userData } = authUser;
  const { rol } = userData;

  return { rol };
};

export default injectIntl(connect(mapStateToProps)(DataListView));
