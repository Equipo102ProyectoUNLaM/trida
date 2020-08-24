import React from 'react';
import NavLinks from './NavLinks';
import CloseBtn from 'assets/landing/images/shapes/close-1-1.png';

const MobileMenu = () => {
  return (
    <div className="side-menu__block">
      <div className="side-menu__block-overlay custom-cursor__overlay">
        <div className="cursor"></div>
        <div className="cursor-follower"></div>
      </div>
      <div className="side-menu__block-inner ">
        <div className="side-menu__top justify-content-end">
          <a href="#" className="side-menu__toggler side-menu__close-btn">
            <img src={CloseBtn} alt="" />
          </a>
        </div>

        <nav className="mobile-nav__container">
          <NavLinks />
        </nav>
        <div className="side-menu__sep"></div>
        <div className="side-menu__content">
          <p>Menu mobile </p>
          <p>
            <a href="mailto:trida.app@gmail.com">trida.app@gmail.com</a> <br />
            <a href="tel:11111111">1111 1111</a>
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

export default MobileMenu;
