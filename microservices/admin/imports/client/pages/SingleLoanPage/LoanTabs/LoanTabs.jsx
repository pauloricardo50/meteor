import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import withMatchParam from 'core/containers/withMatchParam';
import OverviewTab from './OverviewTab';
import BorrowersTab from './BorrowersTab';
import PropertyTab from './PropertyTab';
import OffersTab from './OffersTab';
import CommunicationTab from './CommunicationTab';
import MixpanelAnalytics from './AnalyticsTab';
import ActionsTab from './ActionsTab';
import FilesTab from './FilesTab';
import FormsTab from './FormsTab';
import TasksTab from './TasksTab';

const getTabs = props =>
  [
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
      id: 'communication',
      content: <CommunicationTab {...props} />,
    },
    {
      id: 'analytics',
      content: <MixpanelAnalytics {...props} />,
    },
    {
      id: 'tasks',
      content: <TasksTab {...props} />,
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
  ].map(tab => ({
    ...tab,
    label: <T id={`LoanTabs.${tab.id}`} noTooltips />,
    to: `/loans/${props.loan._id}/${tab.id}`,
  }));

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
