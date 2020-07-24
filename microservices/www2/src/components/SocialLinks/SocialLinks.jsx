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
      <span className="visible-hidden">Instagram</span>
    </a>

    <a href="https://www.linkedin.com/company/epotek/" target="_new">
      <FontAwesomeIcon icon={faLinkedinIn} />
      <span className="visible-hidden">LinkedIn</span>
    </a>

    <a href="https://www.facebook.com/epotekCH/" target="_new">
      <FontAwesomeIcon icon={faFacebookF} />
      <span className="visible-hidden">Facebook</span>
    </a>
  </div>
);

export default SocialLinks;
