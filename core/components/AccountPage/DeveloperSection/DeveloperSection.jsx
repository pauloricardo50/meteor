import React from 'react';

import T from '../../Translation';
import DeveloperSectionContainer from './DeveloperSectionContainer';
import GenerateApiKeyPair from './GenerateApiKeyPair';

const DeveloperSection = ({ user }) => (
  <div className="developper-section animated fadeIn">
    <h2>
      <T defaultMessage="Zone développeur" />
    </h2>
    <p>
      <T
        values={{
          email: <a href="mailto:digital@e-potek.ch">digital@e-potek.ch</a>,
        }}
        defaultMessage="N'hésitez pas à contacter {email} pour obtenir la documentation nécessaire à l'implémentation de l'API."
      />
    </p>
    <GenerateApiKeyPair user={user} />
  </div>
);

export default DeveloperSectionContainer(DeveloperSection);
