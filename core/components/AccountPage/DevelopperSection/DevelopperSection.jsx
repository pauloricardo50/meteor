// @flow
import React from 'react';

import GenerateApiToken from './GenerateApiToken';
import DevelopperSectionContainer from './DevelopperSectionContainer';

type DevelopperSectionProps = {
  user: Object,
};

const DevelopperSection = ({ user }: DevelopperSectionProps) => (
  <div className="developper-section card1 animated fadeIn">
    <h2>Zone développeurs</h2>
    <p>
      N'hésitez pas à contacter&nbsp;
      <a href="mailto:digital@e-potek.ch">digital@e-potek.ch</a> pour obtenir la
      documentation nécessaire à l'implémentation de l'API.
    </p>
    <GenerateApiToken user={user} />
  </div>
);

export default DevelopperSectionContainer(DevelopperSection);
