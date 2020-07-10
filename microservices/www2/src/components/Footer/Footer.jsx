import './Footer.scss';

import React, { useContext } from 'react';
import { faMap } from '@fortawesome/pro-light-svg-icons/faMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import LanguagePicker from '../LanguagePicker';
import NewsletterSignup from '../NewsletterSignup';
import SocialLinks from '../SocialLinks';
import FooterMenu from './FooterMenu';
import FooterNotices from './FooterNotices';

const contactEmail = 'team@e-potek.ch';
const contactPhone = '+41 22 566 01 10';
const locations = {
  lausanne: {
    label: 'Lausanne',
    addressLine1: `Route des Monts-de-Lavaux 1`,
    addressLine2: `1092 Belmont-sur-Lausanne`,
    mapLink: 'https://goo.gl/maps/pRwk15fbYRNHBfdc8',
  },
  geneve: {
    label: 'Genève',
    addressLine1: `Place de Neuve 2`,
    addressLine2: `1204 Genève`,
    mapLink: 'https://goo.gl/maps/ufsN5wd5hv2dxsHj6',
  },
};

const LinkedLocation = ({ location }) => (
  <div
    className="location"
    itemProp="location"
    itemScope
    itemType="http://schema.org/Place"
  >
    <a href={locations[location].mapLink} target="_new" itemProp="hasMap">
      <div className="location-city">
        {locations[location].label}
        <span className="location-map-icon">
          <FontAwesomeIcon icon={faMap} />
        </span>
      </div>

      <div itemProp="address">
        {locations[location].addressLine1}
        <br />
        {locations[location].addressLine2}
      </div>
    </a>
  </div>
);

const Footer = () => {
  const [language] = useContext(LanguageContext);

  return (
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
            <h4>{contactEmail}</h4>
          </a>
        </div>

        <div className="contact-phone">
          <a
            href={`tel:${contactPhone.split(' ').join('')}`}
            itemProp="telephone"
          >
            <h4>{contactPhone}</h4>
          </a>
        </div>

        <hr />

        <div className="contact-locations text-m">
          <div className="contact-location">
            <p>{getLanguageData(language).contactLocationText[0]}</p>
            <LinkedLocation location="lausanne" />
          </div>
          <div className="contact-location">
            <p>{getLanguageData(language).contactLocationText[1]}</p>
            <LinkedLocation location="geneve" />
          </div>
        </div>

        <NewsletterSignup placement="footer" />

        <FooterNotices language={language} />

        <SocialLinks />

        <LanguagePicker />
      </div>
    </footer>
  );
};

export default Footer;
