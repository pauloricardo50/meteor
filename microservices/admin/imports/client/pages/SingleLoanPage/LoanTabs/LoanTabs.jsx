import React from 'react';
import { faChartBar } from '@fortawesome/pro-light-svg-icons/faChartBar';
import { faFolderOpen } from '@fortawesome/pro-light-svg-icons/faFolderOpen';
import { faUniversity } from '@fortawesome/pro-light-svg-icons/faUniversity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { lifecycle } from 'recompose';

import { BORROWERS_COLLECTION } from 'core/api/borrowers/borrowerConstants';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { PROPERTIES_COLLECTION } from 'core/api/properties/propertyConstants';
import { REVENUES_COLLECTION } from 'core/api/revenues/revenueConstants';
import { ROLES } from 'core/api/users/userConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import FileTabs from 'core/components/FileTabs/loadable';
import Icon from 'core/components/Icon';
import PercentWithStatus from 'core/components/PercentWithStatus';
import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import { createRoute } from 'core/utils/routerUtils';

import ADMIN_ROUTES from '../../../../startup/client/adminRoutes';
// import CommunicationTab from './CommunicationTab';
// import MixpanelAnalytics from './AnalyticsTab';
import ActionsTab from './ActionsTab/loadable';
import BorrowersTab from './BorrowersTab/loadable';
import DevTab from './DevTab/loadable';
import FinancingTab from './FinancingTab/loadable';
import InsuranceRequestsTab from './InsuranceRequestsTab/loadable';
import LendersTab from './LendersTab/loadable';
import OverviewTab from './OverviewTab/loadable';
import PromotionsTab from './PromotionsTab/loadable';
import PropertiesTab from './PropertiesTab/loadable';
import RefinancingTab from './RefinancingTab/loadable';
import RevenuesTab from './RevenuesTab/loadable';

const getTabs = props => {
  const { loan, currentUser } = props;
  const borrowersProgress = Calculator.personalInfoPercent({ loan });
  const propertyProgress = Calculator.propertyPercent({ loan });
  const filesProgress = Calculator.filesProgress({ loan }).percent;

  return [
    { id: 'overview', Component: OverviewTab, icon: 'info' },
    {
      id: 'structures',
      Component: FinancingTab,
      icon: <FontAwesomeIcon icon={faChartBar} />,
    },
    loan.hasPromotion && {
      id: 'promotion',
      Component: PromotionsTab,
      style: { color: 'red' },
      icon: collectionIcons[PROMOTIONS_COLLECTION],
    },
    loan.purchaseType === PURCHASE_TYPE.REFINANCING && {
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
      icon: collectionIcons[BORROWERS_COLLECTION],
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
      icon: collectionIcons[PROPERTIES_COLLECTION],
    },
    {
      id: 'insuranceRequests',
      icon: collectionIcons[INSURANCE_REQUESTS_COLLECTION],
      Component: InsuranceRequestsTab,
    },
    {
      id: 'lenders',
      Component: LendersTab,
      icon: <FontAwesomeIcon icon={faUniversity} />,
    },
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
      icon: <FontAwesomeIcon icon={faFolderOpen} />,
    },
    {
      id: 'revenues',
      Component: RevenuesTab,
      icon: collectionIcons[REVENUES_COLLECTION],
    },
    { id: 'actions', Component: ActionsTab, icon: 'settings' },
    currentUser.roles.includes(ROLES.DEV) && {
      id: 'dev',
      Component: DevTab,
      icon: 'developerMode',
    },
  ];
};

const formatTabs = (tabs, props) =>
  tabs
    .filter(x => x)
    .map(({ id, Component, style = {}, additionalLabel, icon = 'help' }) => ({
      id,
      content: <Component {...props} />,
      label: (
        <span style={style} className="single-loan-page-tabs-label">
          <Icon type={icon} className="mr-4" />
          <T id={`LoanTabs.${id}`} noTooltips />
          {additionalLabel && (
            <>
              &nbsp;&bull;&nbsp;
              {additionalLabel}
            </>
          )}
        </span>
      ),
      to:
        props.enableTabRouting &&
        createRoute(ADMIN_ROUTES.SINGLE_LOAN_PAGE.path, {
          loanId: props.loan._id,
          tabId: id,
        }),
    }));

const LoanTabs = ({ tabs, ...props }) => {
  const { enableTabRouting } = props;
  const formattedTabs = formatTabs(tabs || getTabs(props), props);

  return (
    <Tabs
      tabs={formattedTabs}
      routerParamName={enableTabRouting ? 'tabId' : undefined}
      variant="scrollable"
      scrollButtons="auto"
      disableTouchRipple
      className="single-loan-page-tabs"
    />
  );
};

export default lifecycle({
  componentDidMount() {
    OverviewTab.preload();
    FinancingTab.preload();
    PromotionsTab.preload();
    RefinancingTab.preload();
    BorrowersTab.preload();
    PropertiesTab.preload();
    LendersTab.preload();
    FileTabs.preload();
    RevenuesTab.preload();
    ActionsTab.preload();
  },
})(LoanTabs);
