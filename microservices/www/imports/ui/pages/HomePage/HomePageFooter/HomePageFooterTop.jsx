import React from 'react';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';

const HomePageFooterTop = () => (
  <div className="home-page-footer-top">
    <b className="tagline">
      <h2>
        <T id="HomePageHeader.title" />
      </h2>
    </b>
    <Button className="cta" variant="raised" link to="/start/1">
      <T id="general.start" />
    </Button>
  </div>
);

export default HomePageFooterTop;
