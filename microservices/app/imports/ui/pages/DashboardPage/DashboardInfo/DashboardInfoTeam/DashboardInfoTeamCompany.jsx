import React from 'react';
import PropTypes from 'prop-types';

import DashboardInfoTeamMember from './DashboardInfoTeamMember';

const team = [
  {
    src: '/img/yannis.jpg',
    name: 'Yannis Eggert',
    title: 'Directeur',
    email: 'yannis@e-potek.ch',
    phone: '022 566 82 90',
  },
  {
    name: 'Lydia Abraha',
    title: 'Conseillère en financement',
    email: 'lydia@e-potek.ch',
    phone: '022 566 82 92',
  },
];

const DashboardInfoTeamCompany = props => (
  <div>
    {team.map(teamMember => (
      <DashboardInfoTeamMember
        {...teamMember}
        key={teamMember.name}
        src={teamMember.src || '/img/placeholder.png'}
      />
    ))}
  </div>
);

DashboardInfoTeamCompany.propTypes = {};

export default DashboardInfoTeamCompany;
