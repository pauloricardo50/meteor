import React from 'react';

import { ORGANISATION_FEATURES } from 'core/api/organisations/organisationConstants';
import Tabs from 'core/components/Tabs';

import ProductionsCommissionsEditor from '../CommissionRates/ProductionsCommissionsEditor';
import RevenuesToPay from './RevenuesToPay';

const OrganisationRevenues = props => {
  const { name, features } = props;
  return (
    <div>
      <Tabs
        tabs={[
          {
            id: 'commissionRates',
            label: 'Structure de commissionnement',
            condition: features.includes(ORGANISATION_FEATURES.INSURANCE),
            content: <ProductionsCommissionsEditor {...props} />,
          },
          {
            id: 'revenuesToPay',
            label: `${name} -> e-Potek`,
            content: <RevenuesToPay {...props} />,
          },
        ]}
      />
    </div>
  );
};

export default OrganisationRevenues;
