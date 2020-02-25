import React from 'react';
import uniqBy from 'lodash/uniqBy';

import {
  employeesByEmail,
  placeholderEmployee,
} from 'core/arrays/epotekEmployees';
import DashboardInfoTeamMember from './DashboardInfoTeamMember';

// Removes duplicates from an array of objects, by a key in the objects
const removeDuplicates = (array, keyToFilter) => uniqBy(array, keyToFilter);

const getTeam = (mainAssignee, hasPromotion) => {
  let assignee = employeesByEmail['lydia@e-potek.ch'];

  if (mainAssignee) {
    const { email } = mainAssignee;
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

const DashboardInfoTeamCompany = ({ hasPromotion, assignees }) => {
  const mainAssignee = assignees.find(({ $metadata }) => $metadata?.isMain);
  const team = getTeam(mainAssignee, hasPromotion);

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

export default DashboardInfoTeamCompany;
