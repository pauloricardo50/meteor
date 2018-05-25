import React from 'react';

import { Link } from 'react-router-dom';
import T from 'core/components/Translation';

const AboutPageTeamRecruiting = () => (
  <Link to="/careers" className="about-page-team-recruiting">
    <span className="about-page-team-member-image">+</span>
    <div className="about-page-team-member-info">
      <h3>
        <T id="AboutPageTeamRecruiting.title" />
      </h3>
      <h4>
        <T id="AboutPageTeamRecruiting.subtitle" />
      </h4>
      <b className="hover-show">
        <T id="AboutPageTeamRecruiting.hoverText" />
      </b>
    </div>
  </Link>
);

export default AboutPageTeamRecruiting;
