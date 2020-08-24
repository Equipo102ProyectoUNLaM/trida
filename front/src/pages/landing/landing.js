import React from 'react';
import Layout from 'components/landing/Layout';
import Preloader from 'components/landing/Preloader';
import MobileMenu from 'components/landing/MobileMenu';
import Header from 'components/landing/Header';
import Banner from 'components/landing/Banner';
import Footer from 'components/landing/Footer';
import CTAThree from 'components/landing/CTAThree';
import Contact from 'components/landing/Contact';
import Services from 'components/landing/Services';
import CTAOne from 'components/landing/CTAOne';
import Team from 'components/landing/Team';
import Pricing from 'components/landing/Pricing';
import VideoOne from 'components/landing/VideoOne';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'assets/landing/css/apton-icons.css';
import 'assets/landing/css/animate.min.css';
import 'swiper/swiper-bundle.min.css';
import 'assets/landing/css/fontawesome-all.min.css';
import 'assets/landing/css/style.css';
import 'assets/landing/css/responsive.css';
import 'react-modal-video/css/modal-video.min.css';

const HomePage = () => (
  <div>
    <Layout pageTitle="Trída">
      <Header
        btnClass="main-nav__btn"
        extraClassName="site-header-one__fixed-top"
      />
      <MobileMenu />
      <Banner />
      <Services />
      <CTAOne />
      <Pricing />
      {/* <VideoOne /> */}
      <CTAThree />
      <Team />
      <Contact />
      <Footer />
    </Layout>
  </div>
);

export default HomePage;
