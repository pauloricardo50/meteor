// @flow
import React from 'react';

import { ROLES } from 'core/api/constants';
import FileTabs from 'core/components/FileTabs/loadable';
import ActionsTab from '../LoanTabs/ActionsTab/loadable';
import DevTab from '../LoanTabs/DevTab/loadable';
import LendersTab from '../LoanTabs/LendersTab/loadable';
import RevenuesTab from '../LoanTabs/RevenuesTab/loadable';
import LoanTabs from '../LoanTabs';
import PremiumOverviewTab from './PremiumOverviewTab';

type PremiumLoanTabsProps = {};

const getTabs = (props) => {
  const { currentUser } = props;
  return [
    { id: 'overview', Component: PremiumOverviewTab },
    { id: 'lenders', Component: LendersTab },
    { id: 'files', Component: FileTabs },
    { id: 'revenues', Component: RevenuesTab },
    { id: 'actions', Component: ActionsTab },
    currentUser.roles.includes(ROLES.DEV) && {
      id: 'dev',
      Component: DevTab,
    },
  ];
};

const PremiumLoanTabs = (props: PremiumLoanTabsProps) => {
  const tabs = getTabs(props);

  return <LoanTabs {...props} tabs={tabs} />;
};

export default PremiumLoanTabs;
