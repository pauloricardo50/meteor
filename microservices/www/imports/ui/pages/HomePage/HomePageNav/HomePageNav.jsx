import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { T } from 'core/components/Translation';
import { TOGGLE_POINTS } from 'core/api/features/featureConstants';
import TogglePoint from 'core/components/TogglePoint';

const HomePageNav = () => (
  <nav className="home-page-nav">
    <img src="/img/logo_white.svg" alt="e-Potek" />
    <TogglePoint id={TOGGLE_POINTS.HOMEPAGE_LOGIN_BUTTON}>
      <Button raised style={{ margin: 8 }}>
        <T id="general.login" />
        <ArrowRight style={{ marginLeft: 8 }} />
      </Button>
    </TogglePoint>
  </nav>
);

export default HomePageNav;
