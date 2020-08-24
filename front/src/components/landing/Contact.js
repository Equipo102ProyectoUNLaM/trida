import React from 'react';
import BlockTitle from './BlockTitle';
import ContactBgShape from 'assets/landing/images/shapes/contact-bg-shape-1-1.png';
import ContactImage from 'assets/landing/images/shapes/cta-1-shape-1.png';

const Contact = () => {
  return (
    <section id="contact" className="contact-one">
      <img src={ContactBgShape} className="contact-one__bg-shape-1" alt="" />
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <form className="contact-form-validated contact-one__form">
              <BlockTitle
                textAlign="left"
                paraText="Contactanos"
                titleText={`¿Tenés alguna pregunta? Contactanos`}
              />
              <div className="row">
                <div className="col-lg-6">
                  <input type="text" placeholder="Nombre" name="name" />
                </div>
                <div className="col-lg-6">
                  <input type="text" placeholder="Email" name="email" />
                </div>
                <div className="col-lg-6">
                  <input type="text" placeholder="Asunto" name="subject" />
                </div>
                <div className="col-lg-6">
                  <input type="text" placeholder="Teléfono" name="phone" />
                </div>
                <div className="col-lg-12">
                  <textarea
                    placeholder="Escribí tu mensaje"
                    name="message"
                  ></textarea>
                </div>
                <div className="col-lg-12 text-left">
                  <button type="submit" className="thm-btn contact-one__btn">
                    <span>Enviar Mensaje</span>
                  </button>
                </div>
              </div>
            </form>
            <div className="result"></div>
          </div>
          <div
            className="col-lg-5 d-flex wow fadeInRight"
            data-wow-duration="1500ms"
          ></div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
