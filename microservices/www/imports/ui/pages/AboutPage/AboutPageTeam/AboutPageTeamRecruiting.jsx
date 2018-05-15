import React from 'react';

import { Link } from 'react-router-dom';

const AboutPageTeamRecruiting = () => (
  <Link to="/careers" className="about-page-team-recruiting">
    <span className="about-page-team-member-image">+</span>
    <div className="about-page-team-member-info">
      <h3>Vous !</h3>
      <h4>e-Potek recrute</h4>
      <b className="hover-show">Voir nos postes ouverts</b>
    </div>
  </Link>
);

export default AboutPageTeamRecruiting;
