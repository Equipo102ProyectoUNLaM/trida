import PropTypes from 'prop-types';
import React from 'react';
import { Button, Alert, Card, Row, CardBody } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';

class Detail extends React.Component {
  static propTypes = {
    file: PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      extension: PropTypes.string.isRequired,
      url: PropTypes.string,
    }).isRequired,
    close: PropTypes.func,
  };

  handleCloseClick = (event) => {
    if (event) {
      event.preventDefault();
    }
    this.props.close();
  };

  render() {
    let name = this.props.file.key.split('/');
    name = name.length ? name[name.length - 1] : '';

    return (
      <form className="deleting">
        <div>
          <Row>
            <Colxx className="card-delete-message" xxs="12">
              <Card>
                <CardBody className="col-inline">
                  <Alert color="danger" className="rounded center">
                    ¿Está seguro que desea eliminar el archivo seleccionado?
                    Esta acción no podrá deshacerse
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
  }
}

export default Detail;
