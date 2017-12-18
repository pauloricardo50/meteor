import React from 'react';
import { Link } from 'react-router-dom';

import { T } from 'core/components/Translation';

import Buttons from './Buttons';

const Footer = () => (
  <div className="footer">
    <div className="content">
      <div className="container-lrg center">
        <div className="col-7">
          <h1 className="heading thin">
            <T id="HomePage.tagline1" />
            <hr />
            <T id="HomePage.tagline2" />
          </h1>
        </div>
        <div className="col-5">
          <Buttons footer />
        </div>
      </div>
      <div className="container-sml footer-nav text-center">
        <div className="col-12">
          <div>
            <Link className="nav-link" to="/about">
              <T id="HomePage.footer.about" />
            </Link>
            <Link className="nav-link" to="/faq">
              <T id="HomePage.footer.faq" />
            </Link>
            <a
              className="nav-link"
              href="mailto:contact@e-potek.ch?subject=I%20Love%20e-Potek!"
            >
              <T id="HomePage.footer.contact" />
            </a>
            <Link className="nav-link" to="/careers">
              <T id="HomePage.footer.careers" />
            </Link>
            <Link className="nav-link" to="/tos">
              <T id="HomePage.footer.conditions" />
            </Link>
          </div>
          <br />
          <div>
            <span>© 2017 e-Potek</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Footer.propTypes = {};

export default Footer;
