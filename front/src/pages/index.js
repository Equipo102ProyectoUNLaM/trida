import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getDocument } from 'helpers/Firebase-db';

// si es primer login, mostrar pantalla de primer login
// si es invitacion, mostrar cambiar contraseña y luego primer login
// si no es ninguna, ir a seleccion de curso
class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      primerLogin: true,
      cambiarPassword: true,
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData = async () => {
    const datos = await getDocument(`usuarios/${this.props.loginUser}`);
    const { data } = datos;
    console.log(data);
    this.setState({
      cambiarPassword: data.cambiarPassword,
      primerLogin: data.primerLogin,
      cambiarPassword: data.cambiarPassword,
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
  const { user: loginUser } = authUser;

  return { loginUser };
};

export default connect(mapStateToProps)(Main);
