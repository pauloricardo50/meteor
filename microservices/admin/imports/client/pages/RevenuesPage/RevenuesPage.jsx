// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import { createRoute } from 'core/utils/routerUtils';
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
].map(tab => ({
  ...tab,
  // Can't use constant because of circular import
  to: createRoute('/revenues/:tabId?', { tabId: tab.id }),
}));

const RevenuesPage = (props: RevenuesPageProps) => (
  <Tabs tabs={tabs} routerParamName="tabId" />
);

export default RevenuesPage;
