import React from 'react';

import Tabs from 'core/components/Tabs';
import { ORGANISATION_FEATURES } from 'core/api/constants';
import RevenuesToPay from './RevenuesToPay';
import ProductionsCommissionsEditor from '../CommissionRates/ProductionsCommissionsEditor';

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
