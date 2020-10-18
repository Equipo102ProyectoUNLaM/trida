import React from 'react';
import PropTypes from 'prop-types';
import { Button, Alert, Card, Row, CardBody } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';

const ConfirmDeletion = (props) => {
  const { children, handleDeleteSubmit, handleFileClick, url } = props;

  return (
    <form className="deleting" onSubmit={handleDeleteSubmit}>
      <a href={url} download="download" onClick={handleFileClick}>
        {children}
      </a>
      <div>
        <Row>
          <Colxx className="card-delete-message" xxs="12">
            <Card>
              <CardBody className="col-inline">
                <Alert color="danger" className="rounded center">
                  ¿Estás seguro de eliminar el archivo seleccionado? Esta acción
                  no podrá deshacerse
                </Alert>
                <Button
                  color="danger"
                  className="mb-2 delete-button center"
                  type="submit"
                >
                  Eliminar
                </Button>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </div>
    </form>
  );
};

ConfirmDeletion.propTypes = {
  children: PropTypes.node,
  handleDeleteSubmit: PropTypes.func,
  handleFileClick: PropTypes.func,
  url: PropTypes.string,
};

ConfirmDeletion.defaultProps = {
  url: '#',
};

export default ConfirmDeletion;
