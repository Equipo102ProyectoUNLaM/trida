import React from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser, cleanSeleccionCurso } from 'redux/actions';
import { Container } from 'react-bootstrap';

import Cta3Shape1 from 'assets/landing/images/shapes/cta-three-bg-1-1.png';
import Cta3Shape2 from 'assets/landing/images/shapes/cta-three-bg-1-2.png';

const CTAThree = (props) => {
  const history = useHistory();
  const handleRegister = () => {
    if (props.loginUser) {
      props.logoutUser();
      props.cleanSeleccionCurso();
    }

    history.push('/user/register');
    return history.go(0);
  };

  return (
    <section id="trial" className="cta-three">
      <img src={Cta3Shape1} className="cta-three__bg-1" alt="" />
      <img src={Cta3Shape2} className="cta-three__bg-2" alt="" />
      <Container className="text-center">
        <h3>
          Registrate hoy <br /> y empezá a usar la plataforma
        </h3>
        <p>
          comenzá con una prueba gratuita por 3 meses para evaluar los servicios{' '}
        </p>
        <div className="cta-three__btn-wrap">
          <a onClick={handleRegister} className="cta-three__btn">
            <b>Registrate</b>
          </a>
        </div>
      </Container>
    </section>
  );
};

const mapStateToProps = ({ authUser }) => {
  const { user: loginUser } = authUser;
  return { loginUser };
};

export default withRouter(
  connect(mapStateToProps, { logoutUser, cleanSeleccionCurso })(CTAThree)
);
