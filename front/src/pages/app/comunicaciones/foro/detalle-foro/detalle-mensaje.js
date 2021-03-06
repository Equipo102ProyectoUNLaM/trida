import React, { Fragment } from 'react';
import { Card, CardBody } from 'reactstrap';
import { getDateTimeStringFromDate } from 'helpers/Utils';
const publicUrl = process.env.PUBLIC_URL;
const imagenDefaultUsuario = `${publicUrl}/assets/img/defaultUser.png`;

const DetalleMensaje = ({ item, idUsuarioActual, onDelete }) => {
  return (
    <Fragment>
      <Card
        className={`chat-message d-inline-block mb-3 float-${
          item.data.creador !== idUsuarioActual ? 'left' : 'right'
        }`}
      >
        <div className="position-absolute  pt-1 pr-2 r-0 mr-2 mt-2">
          <span className="text-extra-small text-muted">
            {getDateTimeStringFromDate(item.data.fecha_creacion)}
          </span>
        </div>
        <CardBody>
          <div className="d-flex flex-row pb-1">
            <img
              alt={item.data.nombreCreador}
              src={
                item.data.fotoCreador
                  ? item.data.fotoCreador
                  : imagenDefaultUsuario
              }
              className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall"
            />
            <div className=" d-flex flex-grow-1 min-width-zero">
              <div className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                <div className="min-width-zero">
                  <p className="mb-0 truncate list-item-heading">
                    {item.data.nombreCreador}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {onDelete && (
            <div
              className="glyph-icon simple-icon-trash delete-action-icon borrar-mensaje"
              onClick={() => onDelete(item.id)}
            />
          )}
          <div className="chat-text-left">
            <p className="mb-0 text-semi-muted">{item.data.contenido}</p>
          </div>
        </CardBody>
      </Card>
      <div className="clearfix" />
    </Fragment>
  );
};

export default DetalleMensaje;
