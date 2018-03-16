import React from 'react';

import Widget1Inputs from './Widget1Inputs';
import Widget1Recap from './Widget1Recap';
import Widget1Monthly from './Widget1Monthly';

const Widget1Part2 = ({ finma }) => (
  <div className="widget1-part-2">
    <Widget1Inputs finma={finma} />
    <Widget1Recap />
    <Widget1Monthly />
  </div>
);

export default Widget1Part2;
