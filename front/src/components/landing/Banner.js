import React from 'react';

import BannerShape from 'assets/landing/images/shapes/banner-shape-1-1.png';
import BannerBG from 'assets/landing/images/2406-gradient-symbols-pastel-5.png';

const Banner = () => {
  return (
    <section className="banner-one" id="home">
      <img src={BannerShape} className="banner-one__bg-shape-1" alt="" />
      <div
        className="banner-one__bg"
        style={{ backgroundImage: `url(${BannerBG})` }}
      ></div>
      <div className="container">
        <div className="row">
          <div className="banner-text-card">
            <div className="banner-one__content">
              <div className="mc-form__response"></div>
              <h3>
                Digitalizá <br /> tu colegio <br /> con třída
              </h3>
              <p>
                La plataforma que te permite administrar tus instituciones,{' '}
                <br /> cursos y materias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
