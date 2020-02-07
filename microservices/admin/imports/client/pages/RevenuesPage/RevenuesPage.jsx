import React from 'react';

import Tabs from 'core/components/Tabs';
import { createRoute } from 'core/utils/routerUtils';
import RevenuesPageTab from './RevenuesPageTab';
import CommissionsTab from './CommissionsTab';
import MonitoringTab from './MonitoringTab';
import AnalysisTab from './AnalysisTab/loadable';

const tabs = [
  {
    id: 'monitoring',
    label: 'Monitoring',
    content: <MonitoringTab />,
  },
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
  {
    id: 'analysis',
    label: 'Analyse',
    content: <AnalysisTab />,
  },
].map(tab => ({
  ...tab,
  // Can't use constant because of circular import
  to: createRoute('/revenues/:tabId?', { tabId: tab.id }),
}));

const RevenuesPage = props => <Tabs tabs={tabs} routerParamName="tabId" />;

export default RevenuesPage;
