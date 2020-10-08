import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import IconCard from 'containers/pages/IconCards';
import ModalEnviarInvitacion from 'containers/pages/ModalEnviarInvitacion';
import ADMIN_ARRAY from 'constants/adminArray';

class PaginaAdmin extends Component {
  state = {
    isLoading: true,
    modalInvitacionOpen: false,
  };

  toggleModalInvitacion = () => {
    this.setState({
      modalInvitacionOpen: !this.state.modalInvitacionOpen,
    });
  };

  render() {
    const { isLoading, modalInvitacionOpen } = this.state;
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
                  icon={item.icon}
                  title={item.title}
                  to={item.to}
                  className="mb-4"
                  onClick={item.id === 2 ? this.toggleModalInvitacion : null}
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
  const { subject } = seleccionCurso;
  return {
    subject,
  };
};

export default connect(mapStateToProps)(PaginaAdmin);
