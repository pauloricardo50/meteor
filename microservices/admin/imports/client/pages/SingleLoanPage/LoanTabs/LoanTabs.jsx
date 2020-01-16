import React from 'react';
import { lifecycle } from 'recompose';
import { faChartBar } from '@fortawesome/pro-light-svg-icons/faChartBar';
import { faUniversity } from '@fortawesome/pro-light-svg-icons/faUniversity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/pro-light-svg-icons/faFolderOpen';

import Tabs from 'core/components/Tabs';
import Icon from 'core/components/Icon';
import PercentWithStatus from 'core/components/PercentWithStatus';
import T from 'core/components/Translation';
import {
  ROLES,
  PURCHASE_TYPE,
  PROMOTIONS_COLLECTION,
  BORROWERS_COLLECTION,
  REVENUES_COLLECTION,
} from 'core/api/constants';
import FileTabs from 'core/components/FileTabs/loadable';
import { createRoute } from 'core/utils/routerUtils';
import Calculator from 'core/utils/Calculator';
import collectionIcons from 'core/arrays/collectionIcons';
import { PROPERTIES_COLLECTION } from 'imports/core/api/constants';
import ADMIN_ROUTES from '../../../../startup/client/adminRoutes';
import OverviewTab from './OverviewTab/loadable';
import BorrowersTab from './BorrowersTab/loadable';
import PropertiesTab from './PropertiesTab/loadable';
// import CommunicationTab from './CommunicationTab';
// import MixpanelAnalytics from './AnalyticsTab';
import ActionsTab from './ActionsTab/loadable';
import FinancingTab from './FinancingTab/loadable';
import DevTab from './DevTab/loadable';
import PromotionsTab from './PromotionsTab/loadable';
import RefinancingTab from './RefinancingTab/loadable';
import LendersTab from './LendersTab/loadable';
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
