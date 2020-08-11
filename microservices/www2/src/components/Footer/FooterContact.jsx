import React from 'react';
import { faEnvelope } from '@fortawesome/pro-light-svg-icons/faEnvelope';
import { faMap } from '@fortawesome/pro-light-svg-icons/faMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LanguagePicker from '../LanguagePicker';
import NewsletterSignup from '../NewsletterSignup';
import SocialLinks from '../SocialLinks';

const contactEmail = 'team@e-potek.ch';
const locations = {
  lausanne: {
    label: 'Vaud',
    addressLine1: `Route des Monts-de-Lavaux 1`,
    addressLine2: `1092 Belmont-sur-Lausanne`,
    mapLink: 'https://g.page/e-potek-lausanne?gm',
    phone: '+41 21 566 19 99',
  },
  geneve: {
    label: 'Genève',
    addressLine1: `Place de Neuve 2`,
    addressLine2: `1204 Genève`,
    mapLink: 'https://g.page/e-potek-geneve?gm',
    phone: '+41 22 566 01 10',
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

      <div itemProp="address">{locations[location].addressLine1}</div>
      <div itemProp="address">{locations[location].addressLine2}</div>
      <a
        href={`tel:${locations[location].phone.split(' ').join('')}`}
        itemProp="telephone"
        className="footer-contact-location-phone"
      >
        {locations[location].phone}
      </a>

      {/* https://webmasters.stackexchange.com/questions/84988/possible-to-display-none-for-schema-org-image-property */}
      <link
        itemProp="image"
        href="https://e-potek-public.s3.eu-central-1.amazonaws.com/epotek-localbusiness-image.jpg"
      />
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
    <div itemProp="name" hidden>
      e-Potek SA
    </div>

    <div>
      <b>Contactez nos équipes</b>

      <div className="footer-contact-locations">
        <LinkedLocation location="lausanne" />
        <LinkedLocation location="geneve" />
      </div>
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
  </div>
);

export default FooterContact;
