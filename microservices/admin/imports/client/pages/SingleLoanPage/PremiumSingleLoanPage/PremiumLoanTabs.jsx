//      
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversity } from '@fortawesome/pro-light-svg-icons/faUniversity';
import { faFolderOpen } from '@fortawesome/pro-light-svg-icons/faFolderOpen';

import { ROLES, REVENUES_COLLECTION } from 'core/api/constants';
import FileTabs from 'core/components/FileTabs/loadable';
import collectionIcons from 'core/arrays/collectionIcons';
import ActionsTab from '../LoanTabs/ActionsTab/loadable';
import DevTab from '../LoanTabs/DevTab/loadable';
import LendersTab from '../LoanTabs/LendersTab/loadable';
import RevenuesTab from '../LoanTabs/RevenuesTab/loadable';
import LoanTabs from '../LoanTabs';
import PremiumOverviewTab from './PremiumOverviewTab';

                               

const getTabs = props => {
  const { currentUser } = props;
  return [
    { id: 'overview', Component: PremiumOverviewTab, icon: 'info' },
    {
      id: 'lenders',
      Component: LendersTab,
      icon: <FontAwesomeIcon icon={faUniversity} />,
    },
    {
      id: 'files',
      Component: FileTabs,
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

const PremiumLoanTabs = (props                      ) => {
  const tabs = getTabs(props);

  return <LoanTabs {...props} tabs={tabs} />;
};

export default PremiumLoanTabs;
