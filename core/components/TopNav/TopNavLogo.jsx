//
import React from 'react';

import Link from '../Link';

const TopNavlogo = () => (
  <div className="top-nav-logo">
    <Link to="/" className="link">
      <img
        src="/img/logo_square_black.svg"
        alt="e-Potek"
        className="logo-home"
      />
    </Link>
  </div>
);

export default TopNavlogo;
