import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import ModalEnviarInvitacion from 'containers/pages/ModalEnviarInvitacion';

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalInvitacionOpen: false,
    };
  }

  toggleModalInvitacion = () => {
    this.setState({
      modalInvitacionOpen: !this.state.modalInvitacionOpen,
    });
  };

  render() {
    const { modalInvitacionOpen } = this.state;
    return (
      <footer className="page-footer">
        <div className="footer-content">
          <div className="container-fluid">
            <Row>
              <Colxx xxs="12" sm="6">
                <p className="mb-0 text-muted">třída</p>
              </Colxx>
              <Colxx className="col-sm-6 d-none d-sm-block">
                <ul className="breadcrumb pt-0 pr-0 float-right">
                  <li className="breadcrumb-item mb-0">
                    <NavLink
                      className="btn-link"
                      to="#"
                      location={{}}
                      onClick={this.toggleModalInvitacion}
                    >
                      Enviar Invitación
                    </NavLink>
                  </li>
                  <li className="breadcrumb-item mb-0">
                    <NavLink className="btn-link" to="#" location={{}}>
                      Contacto
                    </NavLink>
                  </li>
                  <li className="breadcrumb-item mb-0">
                    <NavLink className="btn-link" to="#" location={{}}>
                      Ayuda
                    </NavLink>
                  </li>
                </ul>
              </Colxx>
            </Row>
          </div>
        </div>
        {modalInvitacionOpen && (
          <ModalEnviarInvitacion
            isOpen={modalInvitacionOpen}
            toggle={this.toggleModalInvitacion}
          />
        )}
      </footer>
    );
  }
}

export default Footer;
