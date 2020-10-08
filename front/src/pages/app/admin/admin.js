import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import IconCard from 'containers/pages/IconCards';
import ModalEnviarInvitacion from 'containers/pages/ModalEnviarInvitacion';
import ADMIN_ARRAY from 'constants/adminArray';
import { getDocumentRef } from 'helpers/Firebase-db';

class PaginaAdmin extends Component {
  state = {
    modalInvitacionOpen: false,
  };

  toggleModalInvitacion = () => {
    this.setState({
      modalInvitacionOpen: !this.state.modalInvitacionOpen,
    });
  };

  handleClick = (id) => {
    if (id === 2) {
      return this.toggleModalInvitacion();
    }

    if (id === 3) {
      const instRef = getDocumentRef(
        `instituciones/${this.props.institution.id}`
      );
      return this.props.history.push({
        pathname: '/seleccion-curso/crear-curso',
        instRef: instRef,
        instId: this.props.institution.id,
      });
    }

    return null;
  };

  render() {
    const { modalInvitacionOpen } = this.state;
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
      </>
    );
  }
}

const mapStateToProps = ({ seleccionCurso }) => {
  const { institution, subject } = seleccionCurso;
  return {
    institution,
    subject,
  };
};

export default connect(mapStateToProps)(PaginaAdmin);
