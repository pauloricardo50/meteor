import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Tabs from 'core/components/Tabs';
import OverviewTab from './OverviewTab';
import OffersTab from './OffersTab';
import ActionsTab from './ActionsTab';
import FormsTab from './FormsTab';
import MixpanelAnalytics from '../../components/MixpanelAnalytics/MixpanelAnalytics';

const getTabs = props => [
  { id: 'overview', label: 'Résumé', content: <OverviewTab {...props} /> },
  { id: 'forms', label: 'Formulaires', content: <FormsTab {...props} /> },
  {
    id: 'offers',
    label: 'Offres des prêteurs',
    content: <OffersTab {...props} />,
  },
  { id: 'actions', label: 'actions', content: <ActionsTab {...props} /> },
  {
    id: 'analytics',
    label: 'Analytics',
    content: <MixpanelAnalytics {...props} />,
  },
];

const LoanTabs = (props) => {
  const tabs = getTabs(props);
  const initialTab = tabs.findIndex(tab => tab.id === queryString.parse(props.location.search).tab);
  return <Tabs initialIndex={initialTab} tabs={tabs} />;
};

LoanTabs.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object),
};

export default LoanTabs;
