import React from 'react';
import { faEnvelope } from '@fortawesome/pro-light-svg-icons/faEnvelope';
import { faMap } from '@fortawesome/pro-light-svg-icons/faMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getLanguageData } from '../../utils/languages';
import LanguagePicker from '../LanguagePicker';
import NewsletterSignup from '../NewsletterSignup';
import SocialLinks from '../SocialLinks';

const contactEmail = 'team@e-potek.ch';
const locations = {
  lausanne: {
    label: 'Vaud',
    addressLine1: `Route des Monts-de-Lavaux 1`,
    addressLine2: `1092 Belmont-sur-Lausanne`,
    mapLink: 'https://goo.gl/maps/pRwk15fbYRNHBfdc8',
    phone: '+41 21 566 19 99',
  },
  geneve: {
    label: 'Genève',
    addressLine1: `Place de Neuve 2`,
    addressLine2: `1204 Genève`,
    mapLink: 'https://goo.gl/maps/ufsN5wd5hv2dxsHj6',
    phone: '+41 21 566 01 10',
  },
};

const LinkedLocation = ({ location }) => (
  <div
    className="footer-contact-location"
    itemProp="location"
    itemScope
    itemType="http://schema.org/Place"
  >
    <a href={locations[location].mapLink} target="_new" itemProp="hasMap">
      <div className="footer-contact-location-city">
        <b>{locations[location].label}</b>
        <span className="footer-contact-location-map-icon">
          <FontAwesomeIcon icon={faMap} />
        </span>
      </div>

      <div itemProp="address">
        {locations[location].addressLine1}
        {', '}
        {locations[location].addressLine2}
      </div>
      <div itemProp="phone">
        <a
          href={`tel:${locations[location].phone.split(' ').join('')}`}
          itemProp="telephone"
        >
          {locations[location].phone}
        </a>
      </div>
    </a>
  </div>
);

const FooterContact = ({ language }) => (
  <div
    className="footer-contact"
    itemScope
    itemType="https://schema.org/LocalBusiness"
  >
    {/* keep here for web crawlers */}
    <h1 itemProp="name" hidden>
      e-Potek SA
    </h1>

    <b>
      <u>Contactez nos équipes</u>
    </b>

    <div className="footer-contact-locations">
      <LinkedLocation location="geneve" />
      <LinkedLocation location="lausanne" />
    </div>

    <div className="footer-contact-links">
      <div className="footer-contact-email">
        <span className="footer-contact-email-icon">
          <FontAwesomeIcon icon={faEnvelope} />
        </span>
        <a href={`mailto:${contactEmail}`} itemProp="email">
          {contactEmail}
        </a>
      </div>
      <NewsletterSignup placement="footer" />
      <SocialLinks />
    </div>
    <LanguagePicker />

    {/* <div className="footer-contact-phone">
      <a href={`tel:${contactPhone.split(' ').join('')}`} itemProp="telephone">
        {contactPhone}
      </a>
    </div> */}
  </div>
);

export default FooterContact;
