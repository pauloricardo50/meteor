import React from 'react';
import { Link } from 'react-router-dom';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';
import TogglePoint, { TOGGLE_POINTS } from 'core/components/TogglePoint';

const WwwTopNav = () => (
  <nav className="www-top-nav">
    <Link to="/" className="logo">
      <img src="/img/logo_white.svg" alt="e-Potek" />
    </Link>
    <TogglePoint id={TOGGLE_POINTS.LITE_VERSION_OFF}>
      <Button raised style={{ margin: 8 }}>
        <T id="general.login" />
      </Button>
    </TogglePoint>
  </nav>
);

export default WwwTopNav;
