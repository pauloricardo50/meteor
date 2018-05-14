import React from 'react';

import { Link } from 'react-router-dom';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';

const AboutPageTeamRecruiting = () => (
  <Link to="/careers" className="about-page-team-recruiting">
    <img src="/img/placeholder.png" alt="" />
    <div className="about-page-team-member-info">
      <h3>Vous !</h3>
      <h4>e-Potek recrute</h4>
      <b className="hover-show">Voir nos postes ouverts</b>
    </div>
  </Link>
);

export default AboutPageTeamRecruiting;
