import './SocialLinks.scss';

import React, { useContext } from 'react';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';

const SocialLinks = () => {
  const [language] = useContext(LanguageContext);

  return (
    <div className="social-links text-m">
      <span>{getLanguageData(language).followUs}</span>

      <a href="https://www.instagram.com/epotekch/" target="_new">
        <FontAwesomeIcon icon={faInstagram} />
      </a>

      <a href="https://www.linkedin.com/company/epotek/" target="_new">
        <FontAwesomeIcon icon={faLinkedinIn} />
      </a>

      <a href="https://www.facebook.com/epotekCH/" target="_new">
        <FontAwesomeIcon icon={faFacebookF} />
      </a>
    </div>
  );
};

export default SocialLinks;
