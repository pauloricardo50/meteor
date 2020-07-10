import './SocialLinks.scss';

import React from 'react';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SocialLinks = () => (
  <div className="social-links">
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

export default SocialLinks;
