import React from 'react';
import { Container } from 'react-bootstrap';

import Cta3Shape1 from 'assets/landing/images/shapes/cta-three-bg-1-1.png';
import Cta3Shape2 from 'assets/landing/images/shapes/cta-three-bg-1-2.png';

const CTAThree = () => {
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
          <a href="/user/register" className="cta-three__btn">
            <b>Registrate</b>
          </a>
        </div>
      </Container>
    </section>
  );
};

export default CTAThree;
