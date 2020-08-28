import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import NavLinks from './NavLinks';
import { logoutUser, cleanSeleccionCurso } from 'redux/actions';

import LogoImage from 'assets/landing/images/logo-nuevo.png';

const HeaderHome = (props) => {
  const [sticky, setSticky] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 70) {
      setSticky(true);
    } else if (window.scrollY < 70) {
      setSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    mobileMenu();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const mobileMenu = () => {
    document
      .querySelector('.side-menu__toggler')
      .addEventListener('click', function (e) {
        document.querySelector('.side-menu__block').classList.toggle('active');
        e.preventDefault();
      });

    //Close Mobile Menu
    let sideMenuCloser = document.querySelectorAll(
      '.side-menu__close-btn, .side-menu__block-overlay'
    );

    sideMenuCloser.forEach((sideMenuCloserBtn) => {
      sideMenuCloserBtn.addEventListener('click', function (e) {
        document.querySelector('.side-menu__block').classList.remove('active');
        e.preventDefault();
      });
    });
  };

  const handleLogout = () => {
    props.logoutUser();
    props.cleanSeleccionCurso();
  };

  return (
    <header
      className={`site-header-one stricky  ${props.extraClassName} ${
        sticky === true ? 'stricky-fixed stricked-menu' : ' '
      }`}
    >
      <div className="container-fluid">
        <div className="site-header-one__logo">
          <a href="/">
            <img src={LogoImage} width="129" alt="" />
          </a>
          <span className="side-menu__toggler">
            <i className="fa fa-bars"></i>
          </span>
        </div>
        <div className="main-nav__main-navigation">
          <NavLinks />
        </div>
        <div className="main-nav__right">
          {!props.loginUser && (
            <a href="/user/login" className={`thm-btn ${props.btnClass}`}>
              <span>Ingresar</span>
            </a>
          )}
          {props.loginUser && (
            <div>
              <a
                href="/seleccion-curso"
                className={`thm-btn ${props.btnClass}`}
              >
                <span>Ingresar a la plataforma</span>
              </a>
              <button
                onClick={() => handleLogout()}
                className={`thm-btn ${props.btnClass}`}
              >
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const mapStateToProps = ({ authUser }) => {
  const { user: loginUser } = authUser;
  return { loginUser };
};

export default connect(mapStateToProps, { logoutUser, cleanSeleccionCurso })(
  HeaderHome
);
