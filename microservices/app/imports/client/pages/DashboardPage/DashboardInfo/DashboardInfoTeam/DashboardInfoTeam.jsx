import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import DashboardInfoTeamCompany from './DashboardInfoTeamCompany';
import DashboardInfoTeamExternal from './DashboardInfoTeamExternal';
import DashboardInfoTeamAdder from './DashboardInfoTeamAdder';
import DashboardInfoTeamContainer from './DashboardInfoTeamContainer';
import NotaryAdder from './NotaryAdder';

const DashboardInfoTeam = ({
  addContact,
  removeContact,
  editContact,
  loan,
  contacts,
}) => {
  const { hasPromotion, assignees } = loan;
  return (
    <div className="dashboard-info-team card1">
      <div className="card-top">
        <h3>
          <T id="DashboardInfoTeam.title" />
        </h3>

        <DashboardInfoTeamCompany
          assignees={assignees}
          hasPromotion={hasPromotion}
        />

        {contacts && contacts.length > 0 && (
          <DashboardInfoTeamExternal
            removeContact={removeContact}
            editContact={editContact}
            contacts={contacts}
          />
        )}
      </div>

      <div className="card-bottom">
        <DashboardInfoTeamAdder addContact={addContact} />
        <NotaryAdder
          contacts={contacts}
          property={Calculator.selectProperty({ loan })}
          addContact={addContact}
        />
      </div>
    </div>
  );
};

DashboardInfoTeam.propTypes = {
  addContact: PropTypes.func.isRequired,
  editContact: PropTypes.func.isRequired,
  loan: PropTypes.object.isRequired,
  removeContact: PropTypes.func.isRequired,
};

export default DashboardInfoTeamContainer(DashboardInfoTeam);
