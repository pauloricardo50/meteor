// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import RevenuesPageTab from './RevenuesPageTab';
import CommissionsTab from './CommissionsTab/CommissionsTab';

type RevenuesPageProps = {};

const tabs = [
  {
    id: 'revenues',
    label: 'Revenus',
    content: <RevenuesPageTab />,
  },
  {
    id: 'commissions',
    label: 'Commissions',
    content: <CommissionsTab />,
  },
];

const RevenuesPage = (props: RevenuesPageProps) => <Tabs tabs={tabs} />;

export default RevenuesPage;
