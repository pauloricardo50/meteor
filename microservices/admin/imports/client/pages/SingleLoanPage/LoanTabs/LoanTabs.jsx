import React from 'react';

import Tabs from 'core/components/Tabs';
import PercentWithStatus from 'core/components/PercentWithStatus';
import T, { Percent } from 'core/components/Translation';
import { ROLES, PURCHASE_TYPE } from 'core/api/constants';
import FileTabs from 'core/components/FileTabs';
import { createRoute } from 'core/utils/routerUtils';
import Calculator from 'core/utils/Calculator';
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

const getTabs = (props) => {
  const { loan } = props;
  const borrowersProgress = Calculator.personalInfoPercent({ loan });
  const propertyProgress = Calculator.propertyPercent({ loan });
  const filesProgress = Calculator.filesProgress({ loan }).percent;

  return [
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
    {
      id: 'borrowers',
      Component: BorrowersTab,
      additionalLabel: (
        <PercentWithStatus
          status={borrowersProgress < 1 ? null : undefined}
          value={borrowersProgress}
          rounded
        />
      ),
    },
    {
      id: 'properties',
      Component: PropertiesTab,
      additionalLabel: (
        <PercentWithStatus
          status={propertyProgress < 1 ? null : undefined}
          value={propertyProgress}
          rounded
        />
      ),
    },
    { id: 'lenders', Component: LendersTab },
    // { id: 'communication', Component: CommunicationTab },
    // { id: 'analytics', Component: MixpanelAnalytics },
    {
      id: 'files',
      Component: FileTabs,
      additionalLabel: (
        <PercentWithStatus
          status={filesProgress < 1 ? null : undefined}
          value={filesProgress}
          rounded
        />
      ),
    },
    { id: 'revenues', Component: RevenuesTab },
    { id: 'actions', Component: ActionsTab },
    props.currentUser.roles.includes(ROLES.DEV) && {
      id: 'dev',
      Component: DevTab,
    },
  ]
    .filter(x => x)
    .map(({ id, Component, style = {}, additionalLabel }) => ({
      id,
      content: <Component {...props} />,
      label: (
        <span style={style} className="single-loan-page-tabs-label">
          <T id={`LoanTabs.${id}`} noTooltips />
          {additionalLabel && (
            <>
              &nbsp;&bull;&nbsp;
              {additionalLabel}
            </>
          )}
        </span>
      ),
      to: createRoute(SINGLE_LOAN_PAGE, { loanId: props.loan._id, tabId: id }),
    }));
};
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
