import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// si es primer login, mostrar pantalla de primer login
// si es invitacion, mostrar cambiar contraseña y luego primer login
// si no es ninguna, ir a seleccion de curso
class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      primerLogin: this.props.primerLogin,
      cambiarPassword: this.props.cambiarPassword,
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData = async () => {
    this.setState({
      isLoading: false,
    });
  };

  render() {
    const { primerLogin, cambiarPassword, isLoading } = this.state;

    if (isLoading) {
      return <div className="loading" />;
    }

    if (cambiarPassword) {
      return <Redirect to="/user/cambiar-password" />;
    }

    if (primerLogin) {
      return <Redirect to="/user/primer-login" />;
    }

    return <Redirect to="/seleccion-curso" />;
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user: loginUser, userData } = authUser;
  const { cambiarPassword, primerLogin } = userData;
  return { loginUser, cambiarPassword, primerLogin };
};

export default connect(mapStateToProps)(Main);
