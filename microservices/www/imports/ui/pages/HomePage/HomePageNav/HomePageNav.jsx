import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';

const HomePageNav = () => (
  <nav className="home-page-nav">
    <img src="/img/logo_black.svg" alt="e-Potek" />
    <Button>
      <T id="general.login" />
    </Button>
  </nav>
);

export default HomePageNav;
