import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'core/components/Tabs';
import { T } from 'core/components/Translation';
import withMatchParam from 'core/containers/withMatchParam';
import OverviewTab from './OverviewTab';
import BorrowersTab from './BorrowersTab';
import PropertyTab from './PropertyTab';
import OffersTab from './OffersTab';
import CommunicationTab from './CommunicationTab';
import MixpanelAnalytics from './AnalyticsTab';
import ActionsTab from './ActionsTab';
import FilesTab from './FilesTab';
import TasksTab from './TasksTab';
import FormsTab from './FormsTab';

const getTabs = props =>
  [
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
      id: 'communication',
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
      content: <TasksTab {...props} />,
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
  ].map(tab => ({ ...tab, to: `/loans/${props.loan._id}/${tab.id}` }));

const LoanTabs = (props) => {
  const tabs = getTabs(props);
  const initialIndex = tabs.map(tab => tab.id).indexOf(props.tabId);

  return (
    <Tabs
      tabs={tabs}
      initialIndex={initialIndex}
      scrollable
      scrollButtons="auto"
    />
  );
};

LoanTabs.propTypes = {
  tabId: PropTypes.string,
};

LoanTabs.defaultProps = {
  tabId: undefined,
};

export default withMatchParam('tabId')(LoanTabs);
