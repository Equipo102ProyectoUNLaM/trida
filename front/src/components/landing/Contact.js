import React, { useState } from 'react';
import BlockTitle from './BlockTitle';
import { functions } from 'helpers/Firebase';
import ContactBgShape from 'assets/landing/images/shapes/contact-bg-shape-1-1.png';
import ContactImage from 'assets/landing/images/contacto2.png';

const Contact = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [asunto, setAsunto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async () => {
    const to = 'trida.app@gmail.com';
    await sendEmail(to, {
      from: 'Trida App <trida.app@gmail.com>',
      subject: asunto,
      html: `<p>mail: ${email} nombre: ${nombre} <br /> telefono: ${telefono} 
      <br /> mensaje: ${mensaje}</p>`,
    });
  };

  const sendEmail = async (email, options) => {
    const sendMail = functions.httpsCallable('sendMail');

    return await sendMail({ email, ...options }).catch(function (error) {
      console.log(error);
    });
  };

  return (
    <section id="contact" className="contact-one">
      <img src={ContactBgShape} className="contact-one__bg-shape-1" alt="" />
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <form
              className="contact-form-validated contact-one__form"
              onSubmit={handleSubmit}
            >
              <BlockTitle
                textAlign="left"
                paraText="Contactanos"
                titleText={`¿Tenés alguna pregunta? Contactanos`}
              />
              <div className="row">
                <div className="col-lg-6">
                  <input
                    type="text"
                    placeholder="Nombre"
                    name="name"
                    onChange={(e) => {
                      setNombre(e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-6">
                  <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-6">
                  <input
                    type="text"
                    placeholder="Asunto"
                    name="subject"
                    onChange={(e) => {
                      setAsunto(e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-6">
                  <input
                    type="text"
                    placeholder="Teléfono"
                    name="phone"
                    onChange={(e) => {
                      setTelefono(e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-12">
                  <textarea
                    placeholder="Escribí tu mensaje"
                    name="message"
                    onChange={(e) => {
                      setMensaje(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="contact-button-wrapper">
                  <button type="submit" className="contact-button">
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
          >
            <div className="my-auto">
              <div className="contact-one__image">
                <img src={ContactImage} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
