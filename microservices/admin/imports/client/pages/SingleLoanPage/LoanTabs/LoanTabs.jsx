import React from 'react';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import { ROLES, PURCHASE_TYPE } from 'core/api/constants';
import FileTabs from 'core/components/FileTabs';
import { createRoute } from 'core/utils/routerUtils';
import { SINGLE_LOAN_PAGE } from '../../../../startup/client/adminRoutes';
import OverviewTab from './OverviewTab';
import BorrowersTab from './BorrowersTab';
import PropertiesTab from './PropertiesTab';
import CommunicationTab from './CommunicationTab';
import MixpanelAnalytics from './AnalyticsTab';
import ActionsTab from './ActionsTab';
import StructuresTab from './StructuresTab';
import DevTab from './DevTab/loadable';
import PromotionsTab from './PromotionsTab';
import RefinancingTab from './RefinancingTab';
import LendersTab from './LendersTab';
import RevenuesTab from './RevenuesTab';

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
    { id: 'lenders', Component: LendersTab },
    // { id: 'communication', Component: CommunicationTab },
    // { id: 'analytics', Component: MixpanelAnalytics },
    { id: 'files', Component: FileTabs },
    { id: 'revenues', Component: RevenuesTab },
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
      to: createRoute(SINGLE_LOAN_PAGE, { loanId: props.loan._id, tabId: id }),
    }));

const LoanTabs = (props) => {
  const tabs = getTabs(props);

  return (
    <Tabs
      tabs={tabs}
      routerParamName="tabId"
      variant="scrollable"
      scrollButtons="auto"
    />
  );
};

export default LoanTabs;
