import React from 'react';
import Overdrive from 'react-overdrive';

import Button from 'core/components/Button';
import Link from 'core/components/Link';

const Widget1Starter = ({ link }) => (
  <Overdrive id="widget1-homepage" duration={400}>
    <div className="widget1-starter card1">
      <h4 className="title">Votre hypothèque simplifiée</h4>

      <Button variant="raised" primary component={Link} to={link}>
        Click me
      </Button>
    </div>
  </Overdrive>
);

export default Widget1Starter;
