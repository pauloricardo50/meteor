import React from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash/uniqBy';

import employees, { placeholderEmployee } from 'core/arrays/epotekEmployees';
import DashboardInfoTeamMember from './DashboardInfoTeamMember';

// Removes duplicates from an array of objects, by a key in the objects
const removeDuplicates = (array, keyToFilter) => uniqBy(array, keyToFilter);

const defaultTeam = [
  {
    src: '/img/team/yannis.jpg',
    name: 'Yannis Eggert',
    title: 'Directeur',
    email: 'yannis@e-potek.ch',
    phone: '022 566 82 90',
  },
];

const DashboardInfoTeamCompany = ({ assignedEmployee }) => {
  let team = defaultTeam;
  if (assignedEmployee) {
    const email = assignedEmployee.emails[0].address;
    const employee = employees.find(item => item.email === email);
    if (employee) {
      team = [employee, ...team];
    } else {
      team = [placeholderEmployee(email), ...team];
    }
  }
  return (
    <React.Fragment>
      {/* Remove duplicates from array if they exist */}
      {removeDuplicates(team, 'email').map(teamMember => (
        <DashboardInfoTeamMember
          {...teamMember}
          key={teamMember.email}
          src={teamMember.src || '/img/placeholder.png'}
        />
      ))}
    </React.Fragment>
  );
};

DashboardInfoTeamCompany.propTypes = {
  assignedEmployee: PropTypes.object,
};

DashboardInfoTeamCompany.defaultProps = {
  assignedEmployee: undefined,
};

export default DashboardInfoTeamCompany;
