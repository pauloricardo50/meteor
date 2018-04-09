import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import DashboardInfoTeamCompany from './DashboardInfoTeamCompany';
import DashboardInfoTeamExternal from './DashboardInfoTeamExternal';
import DashboardInfoTeamAdder from './DashboardInfoTeamAdder';

const DashboardInfoTeam = props => (
  <div className="dashboard-info-team card1">
    <div className="card-top">
      <h3>
        <T id="DashboardInfoTeam.title" />
      </h3>
      <DashboardInfoTeamCompany />
      <DashboardInfoTeamExternal />
    </div>
    <div className="card-bottom">
      <DashboardInfoTeamAdder />
    </div>
  </div>
);

DashboardInfoTeam.propTypes = {};

export default DashboardInfoTeam;
