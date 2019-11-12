import React from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash/uniqBy';

import {
  employeesByEmail,
  placeholderEmployee,
} from 'core/arrays/epotekEmployees';
import DashboardInfoTeamMember from './DashboardInfoTeamMember';

// Removes duplicates from an array of objects, by a key in the objects
const removeDuplicates = (array, keyToFilter) => uniqBy(array, keyToFilter);

const getTeam = (assignedEmployee, hasPromotion) => {
  let assignee = employeesByEmail['lydia@e-potek.ch'];

  if (assignedEmployee) {
    const { email } = assignedEmployee;
    const employee = employeesByEmail[email];
    if (employee) {
      assignee = employee;
    } else {
      assignee = placeholderEmployee;
    }
  }

  if (hasPromotion) {
    return [assignee];
  }

  return [assignee, employeesByEmail['jeanluc@e-potek.ch']];
};

const DashboardInfoTeamCompany = ({ assignedEmployee, hasPromotion }) => {
  const team = getTeam(assignedEmployee, hasPromotion);

  return (
    <>
      {removeDuplicates(team, 'email').map(teamMember => (
        <DashboardInfoTeamMember
          {...teamMember}
          renderTitle={teamMember.appTitle || teamMember.title}
          key={teamMember.email}
          src={teamMember.src || '/img/placeholder.png'}
        />
      ))}
    </>
  );
};

DashboardInfoTeamCompany.propTypes = {
  assignedEmployee: PropTypes.object,
};

DashboardInfoTeamCompany.defaultProps = {
  assignedEmployee: undefined,
};

export default DashboardInfoTeamCompany;
