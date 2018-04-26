import React from 'react';

import { T } from 'core/components/Translation';
import employees from 'core/arrays/epotekEmployees';
import AboutPageTeamMember from './AboutPageTeamMember';
import AboutPageTeamRecruiting from './AboutPageTeamRecruiting';

const AboutPageTeam = () => (
  <div className="about-page-team">
    <h2>
      <T id="AboutPageTeam.title" />
    </h2>
    <div className="about-page-team-list">
      {employees.map(employee => (
        <AboutPageTeamMember key={employee.name} {...employee} />
      ))}
      <AboutPageTeamRecruiting />
    </div>
  </div>
);

export default AboutPageTeam;
