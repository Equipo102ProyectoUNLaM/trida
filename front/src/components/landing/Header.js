import React, { useState, useEffect } from 'react';
import NavLinks from './NavLinks';

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
          <a href="/user/login" className={`thm-btn ${props.btnClass}`}>
            <span>Ingresar</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default HeaderHome;
