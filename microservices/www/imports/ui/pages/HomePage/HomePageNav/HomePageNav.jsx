import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { T } from 'core/components/Translation';

const HomePageNav = () => (
  <nav className="home-page-nav">
    <img src="/img/logo_white.svg" alt="e-Potek" />
    <Button raised style={{ margin: 8 }}>
      <T id="general.login" />
      <ArrowRight style={{ marginLeft: 8 }} />
    </Button>
  </nav>
);

export default HomePageNav;
