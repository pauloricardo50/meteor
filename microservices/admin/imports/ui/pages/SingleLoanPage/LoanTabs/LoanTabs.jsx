import React from 'react';

import Tabs from 'core/components/Tabs';
import { T } from 'core/components/Translation/';
import OverviewTab from './OverviewTab';
import BorrowersTab from './BorrowersTab';
import PropertyTab from './PropertyTab';
import OffersTab from './OffersTab';
import CommunicationTab from './CommunicationTab';
import MixpanelAnalytics from './AnalyticsTab';
import ActionsTab from './ActionsTab';
import FilesTab from './FilesTab';
import FormsTab from './FormsTab';
import LoanTasksTable from './LoanTasksTable';

const getTabs = (props) => {
  const {
    loan: { borrowerIds, property, _id },
  } = props;

  return [
    {
      id: 'overview',
      content: <OverviewTab {...props} />,
    },
    {
      id: 'borrowers',
      content: <BorrowersTab {...props} />,
    },
    {
      id: 'property',
      content: <PropertyTab {...props} />,
    },
    {
      id: 'offers',
      content: <OffersTab {...props} />,
    },
    {
      id: 'comunication',
      content: <CommunicationTab {...props} />,
    },
    {
      id: 'analytics',
      content: <MixpanelAnalytics {...props} />,
    },
    {
      id: 'tasks',
      content: (
        <LoanTasksTable
          showAssignee
          loanId={_id}
          borrowerIds={borrowerIds}
          propertyId={property._id}
        />
      ),
    },
    {
      id: 'forms',
      content: <FormsTab {...props} />,
    },
    {
      id: 'files',
      content: <FilesTab {...props} />,
    },
    {
      id: 'actions',
      content: <ActionsTab {...props} />,
    },
  ].map(tab => ({ ...tab, label: <T id={`LoanTabs.${tab.id}`} noTooltips /> }));
};

const LoanTabs = (props) => {
  const tabs = getTabs(props);

  return <Tabs tabs={tabs} scrollable scrollButtons="auto" />;
};

export default LoanTabs;
