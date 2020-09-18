import React, { Fragment } from 'react';
import { Button, Row } from 'reactstrap';
const publicUrl = process.env.PUBLIC_URL;
const imagenForo = `${publicUrl}/assets/img/imagen-clase-2.png`;

const EncabezadoForo = ({ nombre, descripcionForo, goToForos }) => {
  return (
    <Fragment>
      <Row className="row-space-between">
        <Row>
          <div className="d-flex">
            <img
              src={imagenForo}
              className="img-thumbnail border-0 rounded-circle ml-0 mr-4 list-thumbnail align-self-center small"
            />
          </div>
          <div className=" d-flex min-width-zero">
            <div className="card-body pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
              <div className="min-width-zero">
                <div>
                  <p className="list-item-heading mb-1 truncate ">{nombre}</p>
                </div>
                <p className="mb-0 text-muted text-small">{descripcionForo}</p>
              </div>
            </div>
          </div>
        </Row>
        <Row className="text-zero top-right-button-container mt-1">
          <Button
            color="primary"
            size="lg"
            className="top-right-button half-height"
            onClick={goToForos}
          >
            VOLVER A MIS TEMAS
          </Button>
        </Row>
      </Row>
      <div className="separator mb-5" />
    </Fragment>
  );
};

export default EncabezadoForo;
