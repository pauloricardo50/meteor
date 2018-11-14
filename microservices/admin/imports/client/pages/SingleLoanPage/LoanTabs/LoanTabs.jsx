import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import withMatchParam from 'core/containers/withMatchParam';
import { ROLES } from 'core/api/constants';
import FileTabs from 'core/components/FileTabs';
import OverviewTab from './OverviewTab';
import BorrowersTab from './BorrowersTab';
import PropertiesTab from './PropertiesTab';
import OffersTab from './OffersTab';
import CommunicationTab from './CommunicationTab';
import MixpanelAnalytics from './AnalyticsTab';
import ActionsTab from './ActionsTab';
import StructuresTab from './StructuresTab';
import DevTab from './DevTab/loadable';
import PromotionsTab from './PromotionsTab';

const getTabs = props =>
  [
    { id: 'overview', Component: OverviewTab },
    props.loan.hasPromotion && { id: 'promotion', Component: PromotionsTab },
    { id: 'structures', Component: StructuresTab },
    { id: 'borrowers', Component: BorrowersTab },
    { id: 'properties', Component: PropertiesTab },
    { id: 'offers', Component: OffersTab },
    // { id: 'communication', Component: CommunicationTab },
    // { id: 'analytics', Component: MixpanelAnalytics },
    { id: 'files', Component: FileTabs },
    { id: 'actions', Component: ActionsTab },
    props.currentUser.roles.includes(ROLES.DEV) && {
      id: 'dev',
      Component: DevTab,
    },
  ]
    .filter(x => x)
    .map(({ id, Component }) => ({
      id,
      content: <Component {...props} />,
      label: <T id={`LoanTabs.${id}`} noTooltips />,
      to: `/loans/${props.loan._id}/${id}`,
    }));

const LoanTabs = ({ tabId = 'overview', ...props }) => {
  const tabs = getTabs(props);
  const initialIndex = tabs.map(tab => tab.id).indexOf(tabId);

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
