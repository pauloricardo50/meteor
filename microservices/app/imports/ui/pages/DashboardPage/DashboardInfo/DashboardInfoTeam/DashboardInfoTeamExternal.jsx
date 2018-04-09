import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import DashboardInfoTeamMember from './DashboardInfoTeamMember';

const DashboardInfoTeamExternal = ({
  contacts,
  editContact,
  removeContact,
}) => (
  <div className="dashboard-info-team-external">
    <hr />
    <h3>
      <small>
        <T id="DashboardInfoTeamExternal.title" />
      </small>
    </h3>
    {contacts
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(contact => (
        <DashboardInfoTeamMember
          {...contact}
          key={contact.name}
          allowEdit
          removeContact={removeContact}
          editContact={editContact}
        />
      ))}
  </div>
);

DashboardInfoTeamExternal.propTypes = {
  contacts: PropTypes.array,
  editContact: PropTypes.func.isRequired,
  removeContact: PropTypes.func.isRequired,
};

DashboardInfoTeamExternal.defaultProps = {
  contacts: [],
};

export default DashboardInfoTeamExternal;
