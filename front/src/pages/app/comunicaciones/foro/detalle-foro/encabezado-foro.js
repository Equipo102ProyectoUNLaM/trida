import React, { Fragment } from 'react';
import { Button } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';

const EncabezadoForo = ({ nombre, descripcionForo, goToForos }) => {
  return (
    <Fragment>
      <div className="d-flex flex-row chat-heading" style={{ height: '70px' }}>
        <Colxx lg="10" xxs="6">
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
        </Colxx>

        <Colxx lg="2" xxs="6">
          <div className="text-zero top-right-button-container">
            <Button
              color="primary"
              size="lg"
              className="mt-2 mb-2 mr-2 top-right-button"
              style={{ height: '50px' }}
              onClick={goToForos}
            >
              VOLVER
            </Button>
          </div>
        </Colxx>
      </div>
      <div className="separator mb-5" />
    </Fragment>
  );
};

export default EncabezadoForo;
