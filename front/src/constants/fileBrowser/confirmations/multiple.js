import React from 'react';
import PropTypes from 'prop-types';
import { Button, Alert, Card, Row, CardBody } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';

const MultipleConfirmDeletion = (props) => {
  const { handleDeleteSubmit } = props;

  return (
    <Row>
      <Colxx className="card-delete-message" xxs="12">
        <Card>
          <CardBody className="col-inline">
            <Alert color="danger" className="rounded center">
              ¿Está seguro que desea eliminar todos los archivos seleccionados?
              Esta acción no podrá deshacerse
            </Alert>
            <Button
              color="danger"
              className="mb-2 delete-button center deleting"
              onClick={handleDeleteSubmit}
            >
              Eliminar
            </Button>
          </CardBody>
        </Card>
      </Colxx>
    </Row>
  );
};

MultipleConfirmDeletion.propTypes = {
  handleDeleteSubmit: PropTypes.func,
};

export default MultipleConfirmDeletion;
