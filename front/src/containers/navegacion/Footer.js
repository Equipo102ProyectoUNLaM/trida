import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Badge } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import ModalPlanes from 'containers/pages/ModalPlanes';
import ModalContacto from 'containers/pages/ModalContacto';
import ROLES from 'constants/roles';
import { getDocument } from 'helpers/Firebase-db';
import { connect } from 'react-redux';

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalInvitacionOpen: false,
      modalContactoOpen: false,
      modalPlanesOpen: false,
      docentes: 0,
      alumnos: 0,
      plan: '',
    };
  }

  componentDidMount() {
    this.getPlanInfo();
  }

  getPlanInfo = async () => {
    let docentes = 0;
    let alumnos = 0;
    const institucion = this.props.institution.id;
    const docObj = await getDocument(`usuariosPorInstitucion/${institucion}`);
    const { data } = docObj;
    if (data) {
      for (const usuario of data.usuarios) {
        if (usuario.rol === ROLES.Docente || usuario.rol === ROLES.Directivo) {
          docentes++;
        } else {
          alumnos++;
        }
      }

      this.setState({
        docentes,
        alumnos,
      });
    }

    const plan = this.calculatePlan();
    this.setState({
      plan,
    });
  };

  toggleModalPlanes = () => {
    this.setState({
      modalPlanesOpen: !this.state.modalPlanesOpen,
    });
  };

  toggleModalContacto = () => {
    this.setState({
      modalContactoOpen: !this.state.modalContactoOpen,
    });
  };

  calculatePlan = () => {
    if (this.state.docentes <= 1 && this.state.alumnos <= 5) {
      return 'Plan Gratuito';
    } else if (this.state.docentes <= 5 && this.state.alumnos <= 50) {
      return 'Plan Pequeño';
    } else if (this.state.docentes <= 70 && this.state.alumnos <= 700) {
      return 'Plan Mediano';
    }
    return 'Plan Grande';
  };

  render() {
    const { modalPlanesOpen, plan, modalContactoOpen } = this.state;
    const { rol } = this.props;
    const rolDocente = rol !== ROLES.Alumno;
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
                  {rolDocente && (
                    <li className="breadcrumb-item mb-0">
                      <Badge pill className="badge">
                        <NavLink
                          className="btn-plan"
                          to="#"
                          location={{}}
                          onClick={this.toggleModalPlanes}
                        >
                          {plan}
                        </NavLink>
                      </Badge>
                    </li>
                  )}
                  <li className="breadcrumb-item mb-0">
                    <NavLink
                      className="btn-link"
                      to="#"
                      location={{}}
                      onClick={this.toggleModalContacto}
                    >
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
        {modalPlanesOpen && (
          <ModalPlanes
            isOpen={modalPlanesOpen}
            toggle={this.toggleModalPlanes}
          />
        )}
        {modalContactoOpen && (
          <ModalContacto
            isOpen={modalContactoOpen}
            toggle={this.toggleModalContacto}
          />
        )}
      </footer>
    );
  }
}

const mapStateToProps = ({ authUser, seleccionCurso }) => {
  const { userData } = authUser;
  const { rol } = userData;
  const { institution } = seleccionCurso;
  return { rol, institution };
};

export default connect(mapStateToProps)(Footer);
