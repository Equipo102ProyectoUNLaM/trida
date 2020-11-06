import React, { Fragment } from 'react';

const NavButtons = ({ btnClass, loginUser, handleLogout, mobile }) => {
  return (
    <Fragment>
      <div className="landing-page" style={{ background: 'transparent' }}>
        {!loginUser && (
          <a
            href="/user/login"
            className={`thm-btn ${btnClass} ${
              mobile ? 'side-menu__btn' : 'menu-btn'
            }`}
          >
            <span>Ingresar</span>
          </a>
        )}
        {loginUser && (
          <div>
            <a
              href="/seleccion-curso"
              className={`thm-btn ${btnClass} ${
                mobile ? 'side-menu__btn' : 'margin-left-rem menu-btn'
              }`}
            >
              <span>Acceder a la Plataforma</span>
            </a>
            <a
              onClick={handleLogout}
              className={`thm-btn ${btnClass} ${
                mobile ? 'side-menu__btn' : 'menu-btn'
              }`}
            >
              <span>Cerrar Sesión</span>
            </a>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default NavButtons;
