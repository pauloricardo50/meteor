import React from 'react';

import Tabs from 'core/components/Tabs';

import CommissionsToReceive from '../OrganisationRevenues/CommissionsToReceive';
import CommissionsCommissionsEditor from './CommissionsCommissionsEditor';

const CommissionRates = props => {
  const { name } = props;
  return (
    <div>
      <Tabs
        tabs={[
          {
            id: 'commissionRates',
            label: `Structure de commissionnement`,
            content: <CommissionsCommissionsEditor {...props} />,
          },
          {
            id: 'commissions',
            label: `e-Potek -> ${name}`,
            content: <CommissionsToReceive {...props} />,
          },
        ]}
      />
    </div>
  );
};

export default CommissionRates;
