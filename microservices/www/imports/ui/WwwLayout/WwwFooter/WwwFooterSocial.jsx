import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faLinkedin from '@fortawesome/fontawesome-free-brands/faLinkedin';
import faFacebook from '@fortawesome/fontawesome-free-brands/faFacebook';
import faInstagram from '@fortawesome/fontawesome-free-brands/faInstagram';

const WwwFooterSocial = () =>
  (<div className="social-links">
    <a href="https://www.linkedin.com/company/10995401/">
      <FontAwesomeIcon icon={faLinkedin} size="2x" />
    </a>
    <a href="https://www.facebook.com/epotekCH/">
      <FontAwesomeIcon icon={faFacebook} size="2x" />
    </a>
    <a href="https://www.instagram.com/epotekch/">
      <FontAwesomeIcon icon={faInstagram} size="2x" />
    </a>
  </div>)
;

export default WwwFooterSocial;
