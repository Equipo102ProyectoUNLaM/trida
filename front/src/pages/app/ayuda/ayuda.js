import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import IntlMessages from 'helpers/IntlMessages';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ROLES from 'constants/roles';

class PaginaAyuda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalInvitacionOpen: false,
    };
  }

  render() {
    return (
      <>
        <HeaderDeModulo
          heading="menu.ayuda"
          toggleModal={() => this.props.history.push('/app/home')}
          buttonText="menu.volver"
        />
        <span>
          <IntlMessages id="ayuda.bienvenido" />{' '}
          <IntlMessages id="ayuda.bienvenido-subtitulo" />
        </span>
      </>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { userData } = authUser;
  const { rol } = userData;
  return {
    rol,
  };
};

export default injectIntl(connect(mapStateToProps)(PaginaAyuda));
