import React from 'react';
import Link from 'core/components/Link';

const SideNavHeader = () => (
  <div className="top-bar side-nav-header">
    <Link to="/">
      <img
        src="/img/logo_square_black.svg"
        alt="e-Potek"
        className="logo logo-home"
      />
    </Link>
  </div>
);

export default SideNavHeader;
