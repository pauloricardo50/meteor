import React from 'react';
import { Helmet } from 'react-helmet';

import Icon from 'core/components/Icon/Icon';
import collectionIcons from 'core/arrays/collectionIcons';
import { REVENUES_COLLECTION } from 'core/api/constants';
import CommissionsTable from './CommissionsTable';

const CommissionsTab = props => (
  <div>
    <Helmet>
      <title>Commissions</title>
    </Helmet>

    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[REVENUES_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <span>Commissions</span>
    </h1>

    <CommissionsTable />
  </div>
);

export default CommissionsTab;
