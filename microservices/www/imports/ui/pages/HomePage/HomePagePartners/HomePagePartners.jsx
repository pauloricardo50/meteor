import React from 'react';

import Button from 'core/components/Button';

const HomePagePartners = () => (
  <div className="partners">
    <Button variant="raised" primary className="partner-button">
      Voir nos partenaires
    </Button>
    <div className="list">
      <img src="/partners/UBS_Logo.svg" alt="UBS" />
      <img src="/partners/Credit_Suisse_Logo.svg" alt="Credit Suisse" />
    </div>
  </div>
);

export default HomePagePartners;
