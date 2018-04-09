import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import DashboardInfoTeamMember from './DashboardInfoTeamMember';

const DashboardInfoTeamExternal = ({ contacts }) => (
  <div className="dashboard-info-team-external">
    <hr />
    <h3>
      <small>
        <T id="DashboardInfoTeamExternal.title" />
      </small>
    </h3>
    {contacts.map(contact => (
      <DashboardInfoTeamMember {...contact} key={contact.name} />
    ))}
  </div>
);

DashboardInfoTeamExternal.propTypes = {
  contacts: PropTypes.array,
};

DashboardInfoTeamExternal.defaultProps = {
  contacts: [],
};

export default DashboardInfoTeamExternal;
