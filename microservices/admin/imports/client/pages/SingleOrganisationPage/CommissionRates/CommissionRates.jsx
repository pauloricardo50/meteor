import React from 'react';

import Tabs from 'core/components/Tabs';
import { ORGANISATION_TYPES } from 'imports/core/api/constants';
import ProductionsCommissionsEditor from './ProductionsCommissionsEditor';
import CommissionsCommissionsEditor from './CommissionsCommissionsEditor';

const CommissionRates = props => {
  const { name, type } = props;
  return (
    <div>
      <Tabs
        tabs={[
          {
            id: 'productions',
            label: `${name} -> e-Potek`,
            content: <ProductionsCommissionsEditor {...props} />,
            condition: [
              ORGANISATION_TYPES.INSURANCE,
              ORGANISATION_TYPES.PENSION_FUND,
            ].includes(type),
          },
          {
            id: 'commissions',
            label: `e-Potek -> ${name}`,
            content: <CommissionsCommissionsEditor {...props} />,
          },
        ]}
      />
    </div>
  );
};

export default CommissionRates;
