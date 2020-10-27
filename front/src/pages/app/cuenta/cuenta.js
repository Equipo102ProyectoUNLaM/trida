import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import IntlMessages from 'helpers/IntlMessages';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import DatosForm from './datos-form';
import PasswordForm from './password-form';

class Cuenta extends Component {
  render() {
    return (
      <>
        <HeaderDeModulo
          heading="menu.mi-cuenta"
          toggleModal={() => this.props.history.push('/app/home')}
          buttonText="menu.volver"
        />
        <Row className="cuenta-subtitle mb-3 ml-0">
          <IntlMessages id="cuenta.mis-datos" />{' '}
        </Row>
        <DatosForm />
        <Row className="cuenta-subtitle mb-3 ml-0">
          <IntlMessages id="cuenta.password" />{' '}
        </Row>
        <PasswordForm />
      </>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { userData } = authUser;
  const { rol, nombre, apellido, foto } = userData;
  return {
    foto,
  };
};

export default injectIntl(connect(mapStateToProps)(Cuenta));
