// @flow
import React from 'react';

import { ROLES } from 'core/api/constants';
import ActionsTab from '../LoanTabs/ActionsTab/ActionsTab';
import DevTab from '../LoanTabs/DevTab/DevTab';
import LoanTabs from '../LoanTabs';
import PremiumOverviewTab from './PremiumOverviewTab';

type PremiumLoanTabsProps = {};

const getTabs = (props) => {
  const { currentUser } = props;
  return [
    { id: 'overview', Component: PremiumOverviewTab },
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
