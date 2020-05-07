import React from 'react';
import { Link } from 'gatsby';
import epotekLogo from '../../images/epotek_logo.png';

// TODO: replace logo with SVG version ?
// TODO: either this needs to be localized home, or the root should have localized redirect logic
const TopNavlogo = () => (
  <div className="top-nav-logo">
    <Link to="/" className="link">
      <img src={epotekLogo} alt="e-Potek" className="logo-home" />
    </Link>
  </div>
);

export default TopNavlogo;
