import React, { PropTypes } from 'react';

import { Tabs, Tab } from 'material-ui/Tabs';

import OverviewTab from './OverviewTab.jsx';
import OffersTab from './OffersTab.jsx';
import ActionsTab from './ActionsTab.jsx';
import FormsTab from './FormsTab.jsx';


const RequestTabs = props => {
  return (
    <Tabs>
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
