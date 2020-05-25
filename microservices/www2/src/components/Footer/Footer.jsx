import React from 'react';
import FooterMenu from './FooterMenu';
import LanguagePicker from '../LanguagePicker';
import NewsletterSignup from '../NewsletterSignup';
import SocialLinks from '../SocialLinks';
import './Footer.scss';

const contactEmail = 'team@e-potek.ch';
const contactPhone = '+41 22 566 01 10';
const locations = {
  lausanne: {
    label: 'Lausanne',
    url: '/',
  },
  geneve: {
    label: 'Genève',
    url: '/',
  },
};

const LinkedLocation = ({ location }) => (
  <span itemProp="location" itemScope itemType="http://schema.org/Place">
    <a href={locations[location].url} itemProp="url">
      {locations[location].label}
      {/* TODO: add map icon */}
    </a>
  </span>
);

const Footer = () => (
  <footer className="footer container">
    <FooterMenu />

    <div
      className="contact"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      {/* keep here for web crawlers */}
      <h1 itemProp="name" hidden>
        e-Potek SA
      </h1>

      <div className="contact-email">
        <a href={`mailto:${contactEmail}`} itemProp="email">
          {contactEmail}
        </a>
      </div>

      <div className="contact-phone">
        <a
          href={`tel:${contactPhone.split(' ').join('')}`}
          itemProp="telephone"
        >
          {contactPhone}
        </a>
      </div>

      <hr />

      {/* TODO: localize this content */}
      <p className="contact-locations">
        <span>Trouver nous a </span>
        <LinkedLocation location="lausanne" />
        <br />
        <span>Et a </span>
        <LinkedLocation location="geneve" />
      </p>

      <NewsletterSignup placement="footer" />

      <div className="contact-notices">
        <p>
          e-Potek SA est une société régulée par la{' '}
          <a href="https://www.finma.ch/">FINMA</a>
        </p>
        <p>
          Copyright - e-Potek 2020 • Hébergé et sécurisé Privacy policy • UID :
          CHE-405.084.029 • Finma No. 33709
        </p>
      </div>

      <SocialLinks />

      <LanguagePicker />
    </div>
  </footer>
);

export default Footer;
