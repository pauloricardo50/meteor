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
        defaultMessage="N'hésitez pas à contacter {email} pour obtenir la documentation nécessaire à l'implémentation de l'API."
        values={{
          email: <a href="mailto:digital@e-potek.ch">digital@e-potek.ch</a>,
        }}
      />
    </p>
    <GenerateApiKeyPair user={user} />
  </div>
);

export default DeveloperSectionContainer(DeveloperSection);
