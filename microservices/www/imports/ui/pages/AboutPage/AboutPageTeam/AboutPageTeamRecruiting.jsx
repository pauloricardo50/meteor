import React from 'react';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';

const AboutPageTeamRecruiting = () => (
  <div className="about-page-team-recruiting">
    <img src="/img/placeholder.png" alt="" />
    <div className="about-page-team-member-info">
      <h3>Vous!</h3>
      <h4>e-Potek recrute</h4>
      <Button>
        Voir nos postes ouverts
        <Icon type="right" />
      </Button>
      {/* <a href="">Voir nos postes ouverts</a> */}
    </div>
  </div>
);

export default AboutPageTeamRecruiting;
