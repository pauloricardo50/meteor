import React from 'react';

import Tabs from 'core/components/Tabs';
import { ORGANISATION_TYPES } from 'imports/core/api/constants';
import RevenuesCommissionsEditor from './RevenuesCommissionsEditor';
import CommissionsCommissionsEditor from './CommissionsCommissionsEditor';

const CommissionRates = props => {
  const { name, type } = props;
  return (
    <div>
      <Tabs
        tabs={[
          {
            id: 'revenues',
            label: `${name} -> e-Potek`,
            content: <RevenuesCommissionsEditor {...props} />,
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
