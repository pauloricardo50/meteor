import React from 'react';
import PropTypes from 'prop-types';

import Widget1Inputs from './Widget1Inputs';
import Widget1Monthly from './Widget1Monthly';
import Widget1Recap from './Widget1Recap';

const Widget1Part2 = ({ finma }) => (
  <div className="widget1-part-2 animated fadeIn">
    <Widget1Inputs finma={finma} />
    <Widget1Recap finma={finma} />
    <Widget1Monthly />
  </div>
);

Widget1Part2.propTypes = {
  finma: PropTypes.object.isRequired,
};

export default Widget1Part2;
