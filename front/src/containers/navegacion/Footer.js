import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Badge } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import ModalPlanes from 'containers/pages/ModalPlanes';
import ModalContacto from 'containers/pages/ModalContacto';
import ROLES from 'constants/roles';
import PLANES from 'constants/planes';
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
      esPublica: false,
    };
  }

  componentDidMount() {
    this.getPlanInfo();
  }

  getPlanInfo = async () => {
    let docentes = 0;
    let alumnos = 0;
    const institucion = this.props.institution.id;
    const { data } = await getDocument(
      `instituciones/${this.props.institution.id}`
    );

    if (data.tipo !== 'Colegio Público') {
      const docObj = await getDocument(
        `usuariosPorInstitucion/${this.props.institution.id}`
      );
      const { data } = docObj;
      if (data) {
        for (const usuario of data.usuarios) {
          if (
            usuario.rol === ROLES.Docente ||
            usuario.rol === ROLES.Directivo
          ) {
            docentes++;
          } else {
            alumnos++;
          }
        }

        this.setState({
          docentes,
          alumnos,
          esPublica: false,
        });
      }
      const plan = this.calculatePlan();
      this.setState({
        plan,
      });
    } else {
      this.setState({
        esPublica: true,
        plan: PLANES.Gratuito,
      });
    }
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
      return PLANES.Gratuito;
    } else if (this.state.docentes <= 5 && this.state.alumnos <= 50) {
      return PLANES.Pequeño;
    } else if (this.state.docentes <= 70 && this.state.alumnos <= 700) {
      return PLANES.Mediano;
    }
    return PLANES.Grande;
  };

  render() {
    const { modalPlanesOpen, plan, modalContactoOpen, esPublica } = this.state;
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
                      <Badge
                        pill
                        color="primary"
                        className="font-weight-semibold"
                      >
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
                    <NavLink className="btn-link" to="/app/ayuda" location={{}}>
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
            esPublica={esPublica}
            plan={plan}
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
