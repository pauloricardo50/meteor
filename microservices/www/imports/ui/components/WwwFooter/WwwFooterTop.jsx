import React from 'react';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';

const WwwFooterTop = () => (
  <div className="page-footer-top">
    <b>
      <h2>
        <T id="HomePageHeader.title" />
      </h2>
    </b>
    <Button className="cta" variant="raised" link to="/start/1">
      <T id="general.start" />
    </Button>
  </div>
);

export default WwwFooterTop;
