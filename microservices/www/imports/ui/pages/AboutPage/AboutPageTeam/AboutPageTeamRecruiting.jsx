import React from 'react';

import { Link } from 'react-router-dom';
import T from 'core/components/Translation';

const AboutPageTeamRecruiting = () => (
  <Link to="/careers" className="about-page-team-recruiting">
    <span className="about-page-team-member-image">+</span>
    <div className="about-page-team-member-info">
      <h4>
        <T id="AboutPageTeamRecruiting.title" />
      </h4>
      <h5>
        <T id="AboutPageTeamRecruiting.subtitle" />
      </h5>
      <b className="hover-show">
        <T id="AboutPageTeamRecruiting.hoverText" />
      </b>
    </div>
  </Link>
);

export default AboutPageTeamRecruiting;
