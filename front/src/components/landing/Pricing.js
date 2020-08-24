import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BlockTitle from './BlockTitle';

const Pricing = (props) => {
  const [plan, setPlan] = useState(false);
  return (
    <section className="pricing-one" id="pricing">
      <Container>
        <BlockTitle
          textAlign="center"
          paraText="Planes"
          titleText={`Elegí el plan que se ajuste \n a tus necesidades`}
        />
        <div id="month">
          <Row>
            <Col className="pricing-card">
              <div className="pricing-one__single">
                <div className="pricing-one__circle"></div>
                <div className="pricing-one__inner">
                  <p>Plan Base</p>
                  <h3>Gratis</h3>
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
            <Col className="pricing-card">
              <div className="pricing-one__single">
                <div className="pricing-one__circle"></div>
                <div className="pricing-one__inner">
                  <p>Plan Pequeño</p>
                  <h3>$3.500</h3>
                  <ul className="list-unstyled pricing-one__list">
                    <li>Pago anual</li>
                    <li>5 profesores</li>
                    <li>50 alumnos</li>
                    <li>Acceso completo</li>
                  </ul>
                  <span>Sin costos extra</span>
                </div>
              </div>
            </Col>
            <Col className="pricing-card">
              <div className="pricing-one__single">
                <div className="pricing-one__circle"></div>
                <div className="pricing-one__inner">
                  <p>Plan Mediano</p>
                  <h3>$45.000</h3>
                  <ul className="list-unstyled pricing-one__list">
                    <li>Pago anual</li>
                    <li>70 profesores</li>
                    <li>700 aumnos</li>
                    <li>Acceso completo</li>
                  </ul>
                  <span>Sin costos extra</span>
                </div>
              </div>
            </Col>
            <Col className="pricing-card">
              <div className="pricing-one__single">
                <div className="pricing-one__circle"></div>
                <div className="pricing-one__inner">
                  <p>Plan Grande</p>
                  <h3>$60.000</h3>
                  <ul className="list-unstyled pricing-one__list">
                    <li>Pago anual</li>
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
      </Container>
    </section>
  );
};

export default Pricing;
