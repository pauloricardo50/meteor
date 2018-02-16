import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

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
    { id: 'overview', label: <T id={`LoanTabs.overview`} />'Résumé', content: <OverviewTab {...props} /> },
    {
        id: 'borrowers',
        label: 'Emprunteurs',
        content: <BorrowersTab {...props} />
    },
    { id: 'property', label: 'Propriété', content: <PropertyTab {...props} /> },
    {
        id: 'offers',
        label: 'Offres des prêteurs',
        content: <OffersTab {...props} />
    },
    {
        id: 'comunication',
        label: 'Communication',
        content: <CommunicationTab {...props} />
    },
    {
        id: 'analytics',
        label: 'Analytique',
        content: <AnalyticsTab {...props} />
    },
    { id: 'tasks', label: 'Tâches', content: <TasksTab {...props} /> },
    { id: 'forms', label: 'Formulaires', content: <FormsTab {...props} /> },
    { id: 'actions', label: 'actions', content: <ActionsTab {...props} /> }
];

const LoanTabs = props => {
    const tabs = getTabs(props);
    const initialTab = tabs.findIndex(
        tab => tab.id === queryString.parse(props.location.search).tab
    );
    return <Tabs initialIndex={initialTab} tabs={tabs} />;
};

LoanTabs.propTypes = {
    loan: PropTypes.objectOf(PropTypes.any).isRequired,
    borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
    property: PropTypes.objectOf(PropTypes.any).isRequired,
    offers: PropTypes.arrayOf(PropTypes.object)
};

export default LoanTabs;
