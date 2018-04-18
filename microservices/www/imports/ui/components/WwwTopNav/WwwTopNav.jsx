import React from 'react';

import Button from 'core/components/Button';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { T } from 'core/components/Translation';

const WwwTopNav = () => (
  <nav className="page-top-nav">
    <img src="/img/logo_white.svg" alt="e-Potek" />
    <Button raised style={{ margin: 8 }}>
      <T id="general.login" />
      <ArrowRight style={{ marginLeft: 8 }} />
    </Button>
  </nav>
);

export default WwwTopNav;
