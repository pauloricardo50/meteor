//      
import React from 'react';

import Tabs from 'core/components/Tabs';
import RevenuesToPay from './RevenuesToPay';
import CommissionsToReceive from './CommissionsToReceive';

                                    

const OrganisationRevenues = (props                           ) => {
  const { name } = props;
  return (
    <div>
      <Tabs
        tabs={[
          {
            id: 'revenuesToPay',
            label: `${name} -> e-Potek`,
            content: <RevenuesToPay {...props} />,
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

export default OrganisationRevenues;
