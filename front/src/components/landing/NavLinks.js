import React from 'react';
import { Link as ScrollLink } from 'react-scroll';

const NavLinks = () => {
  return (
    <ul className="main-nav__navigation-box">
      <li>
        <ScrollLink
          activeClass="current"
          to="home"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
        >
          <a>Home</a>
        </ScrollLink>
      </li>
      <li>
        <ScrollLink
          activeClass="current"
          to="features"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
        >
          Servicios
        </ScrollLink>
      </li>
      <li>
        <ScrollLink
          activeClass="current"
          to="publicas"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
        >
          Instituciones Públicas
        </ScrollLink>
      </li>
      <li>
        <ScrollLink
          activeClass="current"
          to="pricing"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
        >
          Precios
        </ScrollLink>
      </li>
      <li>
        <ScrollLink
          activeClass="current"
          to="team"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
        >
          Equipo
        </ScrollLink>
      </li>
      <li>
        <ScrollLink
          activeClass="current"
          to="contact"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
        >
          Contacto
        </ScrollLink>
      </li>
    </ul>
  );
};

export default NavLinks;
