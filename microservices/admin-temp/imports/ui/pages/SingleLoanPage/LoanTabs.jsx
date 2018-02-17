import React from 'react';

import Tabs from 'core/components/Tabs';
import OverviewTab from './OverviewTab';
import BorrowersTab from './BorrowersTab';
import PropertyTab from './PropertyTab';
import OffersTab from './OffersTab';
import CommunicationTab from './CommunicationTab';
import AnalyticsTab from './AnalyticsTab';
import ActionsTab from './ActionsTab';
import TasksTab from './TasksTab';
import FormsTab from './FormsTab';
import { T } from '../../../core/components/Translation/';

const getTabs = props => [
    {
        id: 'overview',
        label: <T id={`LoanTabs.overview`} />,
        content: <OverviewTab {...props} />
    },
    {
        id: 'borrowers',
        // label: <T id={`LoanTabs.borrowers`} />,
        label: 'Emprunteurs',
        content: <BorrowersTab {...props} />
    },
    {
        id: 'property',
        label: <T id={`LoanTabs.property`} />,
        content: <PropertyTab {...props} />
    },
    {
        id: 'offers',
        label: <T id={`LoanTabs.offers`} />,
        content: <OffersTab {...props} />
    },
    {
        id: 'comunication',
        label: <T id={`LoanTabs.communication`} />,
        content: <CommunicationTab {...props} />
    },
    {
        id: 'analytics',
        label: <T id={`LoanTabs.analytics`} />,
        content: <AnalyticsTab {...props} />
    },
    {
        id: 'tasks',
        label: <T id={`LoanTabs.tasks`} />,
        content: <TasksTab {...props} />
    },
    {
        id: 'forms',
        label: <T id={`LoanTabs.forms`} />,
        content: <FormsTab {...props} />
    },
    {
        id: 'actions',
        label: <T id={`LoanTabs.actions`} />,
        content: <ActionsTab {...props} />
    }
];

const LoanTabs = props => {
    const tabs = getTabs(props);

    return <Tabs tabs={tabs} />;
};

export default LoanTabs;
