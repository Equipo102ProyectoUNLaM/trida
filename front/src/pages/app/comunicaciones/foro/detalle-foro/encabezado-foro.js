import React, { Fragment } from 'react';
import { Button } from 'reactstrap';

const EncabezadoForo = ({ nombre, descripcionForo, goToForos }) => {
  return (
    <Fragment>
      <div className="d-flex flex-row chat-heading" style={{ height: '70px' }}>
        <div className=" d-flex min-width-zero">
          <div className="card-body pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
            <div className="min-width-zero">
              <div>
                <p className="list-item-heading mb-1 truncate ">{nombre}</p>
              </div>
              <p className="mb-0 text-muted text-small truncate">
                {descripcionForo}
              </p>
            </div>
          </div>
        </div>
        <div className="d-flex">
          <Button
            color="primary"
            size="lg"
            className="mt-2 mb-2 mr-2"
            style={{ height: '50px' }}
            onClick={goToForos}
          >
            VOLVER
          </Button>
        </div>
      </div>
      <div className="separator mb-5" />
    </Fragment>
  );
};

export default EncabezadoForo;
