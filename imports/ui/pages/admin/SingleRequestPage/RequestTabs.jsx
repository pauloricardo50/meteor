import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Tabs from '/imports/ui/components/general/Tabs';
import OverviewTab from './OverviewTab';
import OffersTab from './OffersTab';
import ActionsTab from './ActionsTab';
import FormsTab from './FormsTab';

const getTabs = props => [
  { id: 'overview', label: 'Résumé', content: <OverviewTab {...props} /> },
  { id: 'forms', label: 'Formulaires', content: <FormsTab {...props} /> },
  {
    id: 'offers',
    label: 'Offres des prêteurs',
    content: <OffersTab {...props} />,
  },
  { id: 'actions', label: 'actions', content: <ActionsTab {...props} /> },
];

const RequestTabs = (props) => {
  const tabs = getTabs(props);
  const initialTab = tabs.findIndex(
    tab => tab.id === queryString.parse(props.location.search).tab,
  );
  return <Tabs initialIndex={initialTab} tabs={tabs} />;
};

RequestTabs.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RequestTabs;
