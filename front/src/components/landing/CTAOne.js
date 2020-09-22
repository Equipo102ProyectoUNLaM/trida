import React from 'react';
import { connect } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import { logoutUser, cleanSeleccionCurso } from 'redux/actions';
import BlockTitle from './BlockTitle';

import CtaShape1 from 'assets/landing/images/shapes/cta-1-shape-1.png';
import CtaShape2 from 'assets/landing/images/shapes/cta-1-shape-2.png';
import CtaMoc1 from 'assets/landing/images/shapes/banner-shape-1-1.png';

const CTAOne = (props) => {
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
    <section id="publicas" className="cta-one">
      <img src={CtaShape1} className="cta-one__bg-shape-1" alt="" />
      <img src={CtaShape2} className="cta-one__bg-shape-2" alt="" />
      <div className="container">
        <div className="row justify-content-start">
          <div className="cta-one-text">
            <div className="cta-one__content">
              <BlockTitle
                textAlign="left"
                titleText={`Apoyo a la educación pública`}
                className="block-title-cta"
              />
              <div className="cta-one__text">
                <p>
                  Para instituciones estatales, el acceso a la plataforma es
                  gratuito.
                </p>
              </div>
              <ul className="list-unstyled cta-one__list">
                <li>
                  <i className="fa fa-check-circle"></i>
                  Cantidad de cursos ilimitados
                </li>
                <li>
                  <i className="fa fa-check-circle"></i>
                  Cantidad de materias por curso ilimitadas
                </li>
                <li>
                  <i className="fa fa-check-circle"></i>
                  Cantidad de usuarios ilimitados
                </li>
              </ul>
              <div className="contact-button-wrapper">
                <a onClick={handleRegister} className="thm-btn cta-one__btn">
                  <span>Registrá tu Institución Pública</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = ({ authUser }) => {
  const { user: loginUser } = authUser;
  return { loginUser };
};

export default withRouter(
  connect(mapStateToProps, { logoutUser, cleanSeleccionCurso })(CTAOne)
);
