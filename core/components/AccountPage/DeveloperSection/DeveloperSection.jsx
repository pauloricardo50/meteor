// @flow
import React from 'react';

import GenerateApiToken from './GenerateApiToken';
import DeveloperSectionContainer from './DeveloperSectionContainer';
import GenerateApiKeyPair from './GenerateApiKeyPair';

type DeveloperSectionProps = {
  user: Object,
};

const DeveloperSection = ({ user }: DeveloperSectionProps) => (
  <div className="developper-section animated fadeIn">
    <h2>Zone développeurs</h2>
    <p>
      N'hésitez pas à contacter&nbsp;
      <a href="mailto:digital@e-potek.ch">digital@e-potek.ch</a> pour obtenir la
      documentation nécessaire à l'implémentation de l'API.
    </p>
    {/* <GenerateApiToken user={user} /> */}
    <GenerateApiKeyPair user={user} />
  </div>
);

export default DeveloperSectionContainer(DeveloperSection);
