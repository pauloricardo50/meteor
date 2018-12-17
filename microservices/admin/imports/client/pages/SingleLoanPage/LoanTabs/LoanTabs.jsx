import React from 'react';
import PropTypes from 'prop-types';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import withMatchParam from 'core/containers/withMatchParam';
import { ROLES, PURCHASE_TYPE } from 'core/api/constants';
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
import RefinancingTab from './RefinancingTab';

const getTabs = props =>
  [
    { id: 'overview', Component: OverviewTab },
    { id: 'structures', Component: StructuresTab },
    props.loan.hasPromotion && {
      id: 'promotion',
      Component: PromotionsTab,
      style: { color: 'red' },
    },
    props.loan.purchaseType === PURCHASE_TYPE.REFINANCING && {
      id: 'refinancing',
      Component: RefinancingTab,
      style: { color: 'red' },
    },
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
    .map(({ id, Component, style = {} }) => ({
      id,
      content: <Component {...props} />,
      label: (
        <span style={style}>
          <T id={`LoanTabs.${id}`} noTooltips />
        </span>
      ),
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
