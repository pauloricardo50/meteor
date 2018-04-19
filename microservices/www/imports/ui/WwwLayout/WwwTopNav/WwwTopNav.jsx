import React from 'react';
import { Link } from 'react-router-dom';

import Button from 'core/components/Button';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { T } from 'core/components/Translation';

const WwwTopNav = () => (
  <nav className="www-top-nav">
    <Link to="/" className="logo">
      <img src="/img/logo_white.svg" alt="e-Potek" />
    </Link>
    <Button raised style={{ margin: 8 }}>
      <T id="general.login" />
      <ArrowRight style={{ marginLeft: 8 }} />
    </Button>
  </nav>
);

export default WwwTopNav;
