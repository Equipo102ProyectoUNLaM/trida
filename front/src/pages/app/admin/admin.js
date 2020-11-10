import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import IconCard from 'containers/pages/IconCards';
import ModalEnviarInvitacion from 'containers/pages/ModalEnviarInvitacion';
import ModalAsignacionMateria from 'containers/pages/ModalAsignacionMateria';
import ADMIN_ARRAY from 'constants/adminArray';
import { getDocumentRef } from 'helpers/Firebase-db';
import ROLES from 'constants/roles';

class PaginaAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInvitacionOpen: false,
      modalAsignacionOpen: false,
    };

    if (this.props.rol === ROLES.Docente) {
      if (!ADMIN_ARRAY.some((elem) => elem.id === 3)) {
        ADMIN_ARRAY.push({
          id: 3,
          title: 'Usuarios de la materia',
          icon: 'iconsminds-male-female',
          to: '/app/admin/alumnos',
        });
      }

      if (!ADMIN_ARRAY.some((elem) => elem.id === 4)) {
        ADMIN_ARRAY.push({
          id: 4,
          title: 'Invitar usuarios',
          icon: 'iconsminds-add-user',
          to: '#',
        });
      }
    }

    if (this.props.rol === ROLES.Directivo) {
      if (!ADMIN_ARRAY.some((elem) => elem.id === 4)) {
        ADMIN_ARRAY.push({
          id: 4,
          title: 'Invitar usuarios',
          icon: 'iconsminds-add-user',
          to: '#',
        });
      }

      if (!ADMIN_ARRAY.some((elem) => elem.id === 5)) {
        ADMIN_ARRAY.push({
          id: 5,
          title: 'Agregar cursos',
          icon: 'iconsminds-folder-add--',
          to: '#',
        });
      }
      if (!ADMIN_ARRAY.some((elem) => elem.id === 6)) {
        ADMIN_ARRAY.push({
          id: 6,
          title: 'Asignar cursos',
          icon: 'iconsminds-network',
          to: '#',
        });
        if (!ADMIN_ARRAY.some((elem) => elem.id === 7)) {
          ADMIN_ARRAY.push({
            id: 7,
            title: 'Asignar rol',
            icon: 'iconsminds-administrator',
            to: '#',
          });
        }
      }
    }
  }

  toggleModalInvitacion = () => {
    this.setState({
      modalInvitacionOpen: !this.state.modalInvitacionOpen,
    });
  };

  toggleModalAsignacion = () => {
    this.setState({
      modalAsignacionOpen: !this.state.modalAsignacionOpen,
    });
  };

  handleClick = (id) => {
    if (id === 2) {
      this.props.history.push(
        `/seleccion-curso/course/${this.props.institution.id}`
      );
    }

    if (id === 4) {
      return this.toggleModalInvitacion();
    }

    if (id === 5) {
      const instRef = getDocumentRef(
        `instituciones/${this.props.institution.id}`
      );
      return this.props.history.push({
        pathname: '/seleccion-curso/crear-curso',
        instRef: instRef,
        instId: this.props.institution.id,
        agregado: true,
      });
    }

    if (id === 6) {
      return this.toggleModalAsignacion();
    }

    return null;
  };

  render() {
    const { modalInvitacionOpen, modalAsignacionOpen } = this.state;
    return (
      <>
        <HeaderDeModulo
          heading="menu.admin"
          toggleModal={() => this.props.history.push('/app/home')}
          buttonText="menu.volver"
        />
        <Row className="icon-cards-row mb-2">
          {ADMIN_ARRAY.map((item) => {
            return (
              <Colxx xxs="6" sm="4" md="3" lg="3" key={`icon_card_${item.id}`}>
                <IconCard
                  id={item.id}
                  icon={item.icon}
                  title={item.title}
                  to={item.to}
                  className="mb-4"
                  onClick={this.handleClick}
                />
              </Colxx>
            );
          })}
        </Row>
        {modalInvitacionOpen && (
          <ModalEnviarInvitacion
            isOpen={modalInvitacionOpen}
            toggle={this.toggleModalInvitacion}
          />
        )}
        {modalAsignacionOpen && (
          <ModalAsignacionMateria
            isOpen={modalAsignacionOpen}
            toggle={this.toggleModalAsignacion}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = ({ seleccionCurso, authUser }) => {
  const { institution, subject } = seleccionCurso;
  const { userData } = authUser;
  const { rol } = userData;
  return {
    institution,
    subject,
    rol,
  };
};

export default connect(mapStateToProps)(PaginaAdmin);
