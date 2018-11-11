import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import DashboardInfoTeamCompany from './DashboardInfoTeamCompany';
import DashboardInfoTeamExternal from './DashboardInfoTeamExternal';
import DashboardInfoTeamAdder from './DashboardInfoTeamAdder';
import DashboardInfoTeamContainer from './DashboardInfoTeamContainer';

const DashboardInfoTeam = ({
  addContact,
  removeContact,
  editContact,
  loan: {
    user: { assignedEmployee },
    hasPromotion,
  },
  contacts,
}) => (
  <div className="dashboard-info-team card1">
    <div className="card-top">
      <h3>
        <T id="DashboardInfoTeam.title" />
      </h3>

      <DashboardInfoTeamCompany
        assignedEmployee={assignedEmployee}
        hasPromotion={hasPromotion}
      />

      {contacts
        && contacts.length > 0 && (
        <DashboardInfoTeamExternal
          removeContact={removeContact}
          editContact={editContact}
          contacts={contacts}
        />
      )}
    </div>

    <div className="card-bottom">
      <DashboardInfoTeamAdder addContact={addContact} />
    </div>
  </div>
);

DashboardInfoTeam.propTypes = {
  addContact: PropTypes.func.isRequired,
  editContact: PropTypes.func.isRequired,
  loan: PropTypes.object.isRequired,
  removeContact: PropTypes.func.isRequired,
};

export default DashboardInfoTeamContainer(DashboardInfoTeam);
