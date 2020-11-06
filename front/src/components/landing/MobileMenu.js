import React from 'react';
import NavLinks from './NavLinks';
import CloseBtn from 'assets/landing/images/shapes/close-1-1.png';
import NavButtons from './NavButtons';
import { logoutUser, cleanSeleccionCurso } from 'redux/actions';
import { connect } from 'react-redux';

const MobileMenu = (props) => {
  const handleLogout = () => {
    props.logoutUser();
    props.cleanSeleccionCurso();
  };

  return (
    <div className="side-menu__block">
      <div className="side-menu__block-overlay custom-cursor__overlay">
        <div className="cursor"></div>
        <div className="cursor-follower"></div>
      </div>
      <div className="side-menu__block-inner ">
        <div className="side-menu__top justify-content-end">
          <a href="/" className="side-menu__toggler side-menu__close-btn">
            <img src={CloseBtn} alt="" />
          </a>
        </div>

        <nav className="mobile-nav__container">
          <NavLinks />
          <NavButtons
            btnClass={props.btnClass}
            loginUser={props.loginUser}
            handleLogout={handleLogout}
            mobile={true}
          />
        </nav>
        <div className="side-menu__sep"></div>
        <div className="side-menu__content">
          <p>
            <a href="mailto:trida.app@gmail.com">trida.app@gmail.com</a> <br />
          </p>
          <div className="side-menu__social">
            <a href="https://twitter.com/trida_ar">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com/trida.ar">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ authUser }) => {
  const { user: loginUser } = authUser;
  return { loginUser };
};

export default connect(mapStateToProps, { logoutUser, cleanSeleccionCurso })(
  MobileMenu
);
