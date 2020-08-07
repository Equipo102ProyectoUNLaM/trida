import React, { Component } from 'react';
import { Row, Card, CardBody, NavLink, Button } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from 'redux/actions';

class CrearInstitution extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      isEmpty: false,
    };
  }

  handleLogout = () => {
    this.props.logoutUser(this.props.history);
  };

  render() {
    return (
      <Colxx xxs="12" className="mb-4 course-col-container">
        <Colxx>
          <h3 className="text-center">
            El usuario con el que ingresaste no posee instituciones asociadas.{' '}
            <br /> Podés crear tu institución o cerrar sesión para ingresar con
            otro usuario.
          </h3>
          <Row className="button-group-centered">
            <Button
              color="primary"
              onClick={() =>
                this.props.history.push('/seleccion-curso/crear-institucion')
              }
              className="button"
            >
              Crear Institución
            </Button>
            <Button
              color="primary"
              onClick={() => this.handleLogout()}
              className="button"
            >
              Cerrar sesión
            </Button>
          </Row>
        </Colxx>
      </Colxx>
    );
  }
}

export default withRouter(
  connect(null, {
    logoutUser,
  })(CrearInstitution)
);
