import React from 'react';
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

class DataListView extends React.Component {
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
      sonPreguntas,
      modalLanzarPreguntas,
      preguntaALanzar,
      onSelectPregunta,
      seLanzo,
      entregada,
    } = this.props;
    return (
      <Colxx xxs="12" className="mb-3">
        <ContextMenuTrigger id="menu_id" data={id} collect={collect}>
          <Card
            className={classnames('d-flex flex-row', {
              active: isSelect,
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
                <p className=" list-item-heading mb-1 truncate card-body">
                  {title}
                </p>
              )}
              {modalLanzarPreguntas && (
                <p
                  className="list-item-heading mb-1 truncate card-body modalLanzarPreguntas"
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
                <NavLink to={`${navTo}`} className="w-90 w-sm-100 active">
                  <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                    <p className="list-item-heading mb-1 truncate practicas-list-label">
                      {title}
                    </p>
                    {text1 && (
                      <p className="mb-1 text-small w-sm-100 practicas-list-label">
                        {text1}
                      </p>
                    )}
                    {text2 && (
                      <p className="mb-1 text-small w-sm-100 practicas-list-label">
                        {text2}
                      </p>
                    )}
                  </div>
                </NavLink>
              )}
              <div className="custom-control custom-checkbox pl-1 align-self-center pr-4 practicas-list-label">
                <Row>
                  {file !== undefined && (
                    <Button
                      outline
                      onClick={() => this.onDownloadFile(file)}
                      size="sm"
                      color="primary"
                      className="button datalist-button"
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
                      className="button datalist-button"
                    >
                      Subir Práctica
                    </Button>
                  )}
                  {onCorrection && (
                    <Button
                      outline
                      onClick={() => onCorrection(id)}
                      size="sm"
                      color="primary"
                      className="button datalist-button"
                    >
                      Corregir
                    </Button>
                  )}
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
                </Row>
              </div>
            </div>
            {entregada && this.props.rol === ROLES.Alumno && (
              <div>
                <Badge color="primary" pill className="mb-1">
                  ENTREGADA
                </Badge>
              </div>
            )}
            {!entregada && this.props.rol === ROLES.Alumno && (
              <div>
                <Badge color="danger" pill className="mb-1">
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
