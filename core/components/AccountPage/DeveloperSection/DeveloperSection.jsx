// @flow
import React from 'react';

import T from 'core/components/Translation';
import DeveloperSectionContainer from './DeveloperSectionContainer';
import GenerateApiKeyPair from './GenerateApiKeyPair';

type DeveloperSectionProps = {
  user: Object,
};

const DeveloperSection = ({ user }: DeveloperSectionProps) => (
  <div className="developper-section animated fadeIn">
    <h2>
      <T id="AccountPage.DevelopperSection.title" />
    </h2>
    <p>
      <T
        id="AccountPage.DevelopperSection.description"
        values={{
          email: <a href="mailto:digital@e-potek.ch">digital@e-potek.ch</a>,
        }}
      />
    </p>
    <GenerateApiKeyPair user={user} />
  </div>
);

export default DeveloperSectionContainer(DeveloperSection);
