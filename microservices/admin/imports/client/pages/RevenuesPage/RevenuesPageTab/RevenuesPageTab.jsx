// @flow
import React from 'react';
import { Helmet } from 'react-helmet';

import { REVENUES_COLLECTION } from 'core/api/constants';
import Icon from 'core/components/Icon/Icon';
import collectionIcons from 'core/arrays/collectionIcons';
import RevenuesPageTable from './RevenuesPageTable';

type RevenuesPageTabProps = {};

const RevenuesPageTab = (props: RevenuesPageTabProps) => (
  <div>
    <Helmet>
      <title>Revenus</title>
    </Helmet>

    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[REVENUES_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <span>Revenus</span>
    </h1>

    <RevenuesPageTable />
  </div>
);

export default RevenuesPageTab;
