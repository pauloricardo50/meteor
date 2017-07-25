import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Tabs from 'material-ui/Tabs/Tabs';
import Tab  from 'material-ui/Tabs/Tab';

import OverviewTab from './OverviewTab.jsx';
import OffersTab from './OffersTab.jsx';
import ActionsTab from './ActionsTab.jsx';
import FormsTab from './FormsTab.jsx';

const tabs = ['overview', 'forms', 'offers', 'actions'];

const RequestTabs = props => {
  const tab = queryString.parse(props.location.search).tab || tabs[0];
  return (
    <Tabs initialSelectedIndex={tabs.indexOf(tab)}>
      <Tab label="Overview">
        <OverviewTab {...props} />
      </Tab>
      <Tab label="Formulaires">
        <FormsTab {...props} />
      </Tab>
      <Tab label="Offres des Prêteurs">
        <OffersTab {...props} />
      </Tab>
      <Tab label="Actions">
        <ActionsTab {...props} />
      </Tab>
    </Tabs>
  );
};

RequestTabs.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RequestTabs;
