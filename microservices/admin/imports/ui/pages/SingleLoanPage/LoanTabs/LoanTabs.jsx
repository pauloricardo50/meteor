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
      label: <T id="LoanTabs.overview" />,
      content: <OverviewTab {...props} />,
    },
    {
      id: 'borrowers',
      label: <T id="LoanTabs.borrowers" noTooltips />,
      content: <BorrowersTab {...props} />,
    },
    {
      id: 'property',
      label: <T id="LoanTabs.property" />,
      content: <PropertyTab {...props} />,
    },
    {
      id: 'offers',
      label: <T id="LoanTabs.offers" />,
      content: <OffersTab {...props} />,
    },
    {
      id: 'comunication',
      label: <T id="LoanTabs.communication" />,
      content: <CommunicationTab {...props} />,
    },
    {
      id: 'analytics',
      label: <T id="LoanTabs.analytics" />,
      content: <MixpanelAnalytics {...props} />,
    },
    {
      id: 'tasks',
      label: <T id="LoanTabs.tasks" />,
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
      label: <T id="LoanTabs.forms" />,
      content: <FormsTab {...props} />,
    },
    {
      id: 'files',
      label: <T id="LoanTabs.files" />,
      content: <FilesTab {...props} />,
    },
    {
      id: 'actions',
      label: <T id="LoanTabs.actions" />,
      content: <ActionsTab {...props} />,
    },
  ];
};

const LoanTabs = (props) => {
  const tabs = getTabs(props);

  return <Tabs tabs={tabs} scrollable scrollButtons="auto" />;
};

export default LoanTabs;
