import React from 'react';
import BlockTitle from './BlockTitle';

import TeamShape1 from 'assets/landing/images/shapes/team-1-bg-1-1.png';
import TeamShape2 from 'assets/landing/images/shapes/team-1-bg-1-2.png';
import TeamMemeber1 from 'assets/landing/images/team/mati.png';
import TeamMemeber2 from 'assets/landing/images/team/mica.png';
import TeamMemeber3 from 'assets/landing/images/team/juli.png';
import TeamMemeber4 from 'assets/landing/images/team/lauti.png';
import TeamMemeber5 from 'assets/landing/images/team/thomi.png';

const Team = () => {
  return (
    <section className="team-one" id="team">
      <img src={TeamShape1} className="team-one__bg-shape-1" alt="" />
      <img src={TeamShape2} className="team-one__bg-shape-2" alt="" />
      <div className="container">
        <BlockTitle
          textAlign="center"
          paraText="Equipo"
          titleText={`Conocé a los miembros \n de nuestro equipo`}
        />
        <div className="row">
          <div className="team-card">
            <div className="team-one__single">
              <div className="team-one__circle"></div>
              <div className="team-one__inner">
                <h3>Matias Cairo</h3>
                <p>Desarrollador</p>
                <div className="team-one__image">
                  <img src={TeamMemeber1} alt="" />
                </div>
                <div className="team-one__social">
                  <a
                    href="https://www.linkedin.com/in/matias-cairo-56b7a0b6/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/maticairo/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="team-card">
            <div className="team-one__single">
              <div className="team-one__circle"></div>
              <div className="team-one__inner">
                <h3>Micaela De Rito</h3>
                <p>Desarolladora</p>
                <div className="team-one__image">
                  <img src={TeamMemeber2} alt="" />
                </div>
                <div className="team-one__social">
                  <a
                    href="https://www.linkedin.com/in/micaela-de-rito-016776a7/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/miccucha/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="team-card">
            <div className="team-one__single">
              <div className="team-one__circle"></div>
              <div className="team-one__inner">
                <h3>Julieta Foglia</h3>
                <p>Desarrolladora</p>
                <div className="team-one__image">
                  <img src={TeamMemeber3} alt="" />
                </div>
                <div className="team-one__social">
                  <a
                    href="https://www.linkedin.com/in/julieta-foglia/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/julitys/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="team-card">
            <div className="team-one__single">
              <div className="team-one__circle"></div>
              <div className="team-one__inner">
                <h3>Lautaro Perez</h3>
                <p>Desarrollador</p>
                <div className="team-one__image">
                  <img src={TeamMemeber4} alt="" />
                </div>
                <div className="team-one__social">
                  <a
                    href="https://www.linkedin.com/in/lautaro-perez-72138519a/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/laautaperez/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="team-card">
            <div className="team-one__single">
              <div className="team-one__circle"></div>
              <div className="team-one__inner">
                <h3>Thomas Reynoso</h3>
                <p>Desarrollador</p>
                <div className="team-one__image">
                  <img src={TeamMemeber5} alt="" />
                </div>
                <div className="team-one__social">
                  <a
                    href="https://www.linkedin.com/in/thomas-reynoso/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/thomireynoso/"
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
    </section>
  );
};

export default Team;
