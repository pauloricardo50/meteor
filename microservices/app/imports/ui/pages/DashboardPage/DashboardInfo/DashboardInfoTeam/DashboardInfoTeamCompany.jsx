import React from 'react';
import PropTypes from 'prop-types';

import employees, { placeholderEmployee } from 'core/arrays/epotekEmployees';
import DashboardInfoTeamMember from './DashboardInfoTeamMember';

const removeDuplicates = (arr, prop) => {
  const obj = {};
  return Object.keys(arr.reduce((prev, next) => {
    if (!obj[next[prop]]) obj[next[prop]] = next;
    return obj;
  }, obj)).map(i => obj[i]);
};

const defaultTeam = [
  {
    src: '/img/yannis.jpg',
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
    <div>
      {/* Remove duplicates from array if they exist */}
      {removeDuplicates(team, 'email').map(teamMember => (
        <DashboardInfoTeamMember
          {...teamMember}
          key={teamMember.name}
          src={teamMember.src || '/img/placeholder.png'}
        />
      ))}
    </div>
  );
};

DashboardInfoTeamCompany.propTypes = {
  assignedEmployee: PropTypes.object,
};

DashboardInfoTeamCompany.defaultProps = {
  assignedEmployee: undefined,
};

export default DashboardInfoTeamCompany;
