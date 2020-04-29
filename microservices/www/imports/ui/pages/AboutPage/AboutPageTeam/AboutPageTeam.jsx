import React from 'react';

import employees from 'core/arrays/epotekEmployees';
import T from 'core/components/Translation';

import AboutPageTeamMember from './AboutPageTeamMember';

const getLastName = string => string.split(' ').slice(-1)[0];

const sortByLastName = ({ name: name1 }, { name: name2 }) => {
  const lastName1 = getLastName(name1);
  const lastName2 = getLastName(name2);
  if (lastName1 < lastName2) return -1;
  if (lastName1 > lastName2) return 1;
  return 0;
};

const AboutPageTeam = () => (
  <div className="about-section about-page-team">
    <h2>
      <T id="AboutPageTeam.title" />
    </h2>
    <div className="about-page-team-list">
      {employees
        .filter(({ hideFromTeam }) => !hideFromTeam)
        .sort(sortByLastName)
        .map(employee => (
          <AboutPageTeamMember key={employee.name} {...employee} />
        ))}
    </div>
  </div>
);

export default AboutPageTeam;
