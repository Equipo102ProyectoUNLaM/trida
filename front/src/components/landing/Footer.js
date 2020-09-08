import React from 'react';

import FooterLogo from 'assets/landing/images/logo-nuevo.png';

const Footer = () => {
  return (
    <div>
      <footer className="site-footer">
        <div className="site-footer__upper">
          <div className="container">
            <div className="row">
              <div className="footer-element">
                <div className="footer-widget footer-widget__about">
                  <a href="index.html">
                    <img src={FooterLogo} width="129" alt="" />
                  </a>
                  <p>Tu aula en casa</p>
                </div>
              </div>
              <div className="footer-element">
                <div className="footer-widget">
                  <div className="footer-widget__social">
                    <a
                      href="https://twitter.com/trida_ar"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a
                      href="https://www.instagram.com/trida_ar/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="site-footer__bottom">
          <div className="container text-center">
            <p>© copyright 2020 trida.com.ar</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
