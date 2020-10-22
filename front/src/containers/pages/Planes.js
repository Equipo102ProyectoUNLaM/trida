import React from 'react';
import PLANES from 'constants/planes';
import { Container, Row, Col } from 'react-bootstrap';

const Planes = ({ plan }) => {
  return (
    <section className="pricing-one-no-padding" id="pricing">
      <Container className="text-center">
        <h3 className="header-planes">Prueba Gratuita</h3>
        <p className="text-planes">
          Ofrecemos una prueba gratuita por 3 meses para evaluar los servicios{' '}
        </p>
      </Container>
      <Container>
        <Container className="text-center mt-2">
          <h3 className="header-planes mt-2">Planes de Pago</h3>
          <p className="text-planes">
            Luego de la prueba, contamos con los siguientes planes{' '}
          </p>
        </Container>

        <div id="month">
          <Row>
            <Col className="pricing-card-less-padding">
              <div className="pricing-one__single">
                <div className="pricing-one__circle"></div>
                <div
                  className={
                    plan === PLANES.Base
                      ? 'pricing-one__inner-highlight'
                      : 'pricing-one__inner'
                  }
                >
                  <p>{PLANES.Base}</p>
                  <h3 className="font-size-2">Gratis *</h3>
                  <ul className="list-unstyled pricing-one__list">
                    <li>Uso gratuito</li>
                    <li>1 profesor</li>
                    <li>5 alumnos</li>
                    <li>Acceso completo</li>
                  </ul>
                  <span>Sin costos extra</span>
                </div>
              </div>
            </Col>
            <Col className="pricing-card-less-padding">
              <div className="pricing-one__single">
                <div className="pricing-one__circle"></div>
                <div
                  className={
                    plan === PLANES.Pequeño
                      ? 'pricing-one__inner-highlight'
                      : 'pricing-one__inner'
                  }
                >
                  <p>{PLANES.Pequeño}</p>
                  <h3 className="font-size-2">ARS $300 *</h3>
                  <ul className="list-unstyled pricing-one__list">
                    <li>Pago mensual</li>
                    <li>5 profesores</li>
                    <li>50 alumnos</li>
                    <li>Acceso completo</li>
                  </ul>
                  <span>Sin costos extra</span>
                </div>
              </div>
            </Col>
            <Col className="pricing-card-less-padding">
              <div className="pricing-one__single">
                <div className="pricing-one__circle"></div>
                <div
                  className={
                    plan === PLANES.Mediano
                      ? 'pricing-one__inner-highlight'
                      : 'pricing-one__inner'
                  }
                >
                  <p>{PLANES.Mediano}</p>
                  <h3 className="font-size-2">ARS $3750 *</h3>
                  <ul className="list-unstyled pricing-one__list">
                    <li>Pago mensual</li>
                    <li>70 profesores</li>
                    <li>700 aumnos</li>
                    <li>Acceso completo</li>
                  </ul>
                  <span>Sin costos extra</span>
                </div>
              </div>
            </Col>
            <Col className="pricing-card-less-padding">
              <div className="pricing-one__single">
                <div className="pricing-one__circle"></div>
                <div
                  className={
                    plan === PLANES.Grande
                      ? 'pricing-one__inner-highlight'
                      : 'pricing-one__inner'
                  }
                >
                  <p>{PLANES.Grande}</p>
                  <h3 className="font-size-2">ARS $5000 *</h3>
                  <ul className="list-unstyled pricing-one__list">
                    <li>Pago mensual</li>
                    <li>Profesores ilimitados</li>
                    <li>Alumnos ilimitados</li>
                    <li>Acceso completo</li>
                  </ul>
                  <span>Sin costos extra</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <h3 className="font-size-small text-planes">
          * Válido hasta el 31/12/2020
        </h3>
      </Container>
    </section>
  );
};

export default Planes;
