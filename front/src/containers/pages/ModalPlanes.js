import React from 'react';
import { Button, ModalFooter } from 'reactstrap';
import Planes from './Planes';
import ModalGrande from 'containers/pages/ModalGrande';
import 'assets/landing/css/style.scss';
import 'assets/landing/css/responsive.scss';

class ModalPlanes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalPlanesOpen: false,
    };
  }

  render() {
    const { isOpen, toggle, esPublica, plan } = this.props;
    return (
      <ModalGrande
        modalOpen={isOpen}
        toggleModal={this.toggleModal}
        text="Planes de Pago"
      >
        {!esPublica && (
          <div className="landing-page">
            <Planes plan={plan} />
          </div>
        )}
        {esPublica && (
          <div className="landing-page">
            <div className="cta-one__text">
              <p>
                Para instituciones estatales, el acceso a la plataforma es
                gratuito.
              </p>
            </div>
            <ul className="list-unstyled cta-one__list">
              <li>
                <i className="fa fa-check-circle"></i>
                Cantidad de cursos ilimitados
              </li>
              <li>
                <i className="fa fa-check-circle"></i>
                Cantidad de materias por curso ilimitadas
              </li>
              <li>
                <i className="fa fa-check-circle"></i>
                Cantidad de usuarios ilimitados
              </li>
            </ul>
          </div>
        )}
        <ModalFooter>
          <Button color="primary" size="sm" onClick={toggle}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalGrande>
    );
  }
}

export default ModalPlanes;
