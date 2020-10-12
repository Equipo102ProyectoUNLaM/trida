import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';

class Footer extends React.Component {
  render() {
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
      </footer>
    );
  }
}

export default Footer;
