import React from 'react';
import { Link } from 'react-router-dom';

import HomeDev from '/imports/ui/components/general/HomeDev';
import track from '/imports/js/helpers/analytics';
import { T } from '/imports/ui/components/general/Translation';

import Button from '/imports/ui/components/general/Button';

const styles = {
  style: {
    height: 50,
    marginRight: 8,
    marginTop: 8,
  },
  button: {
    height: 50,
  },
  label: {
    fontSize: '1.2em',
    height: 50,
    display: 'inline-block',
  },
};

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
          <div className="ctas text-right">
            <Button
              raised
              label={<T id="HomePage.compare" />}
              containerElement={<Link to="/app/compare" />}
              style={styles.style}
              buttonStyle={styles.button}
              labelStyle={styles.label}
              overlayStyle={styles.button}
              onClick={() =>
                track('Funnel - clicked home page CTA', {
                  title: 'compare',
                  at: 'bottom',
                })}
            />
            <Button
              raised
              label={<T id="HomePage.CTA1" />}
              containerElement={<Link to="/start1/acquisition" />}
              style={styles.style}
              buttonStyle={styles.button}
              labelStyle={styles.label}
              overlayStyle={styles.button}
              onClick={() =>
                track('Funnel - clicked home page CTA', {
                  title: 'acquisition',
                  at: 'bottom',
                })}
            />
            <HomeDev
              style={styles.style}
              buttonStyle={styles.button}
              labelStyle={styles.label}
              overlayStyle={styles.button}
              handleClick={() =>
                track('Funnel - clicked home page CTA', {
                  title: 'refinancing',
                  at: 'bottom',
                })}
            />
          </div>
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
