import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import RecapSimple from 'core/components/Recap/RecapSimple';
import Widget1RecapContainer from './Widget1RecapContainer';
import Widget1Finma from './Widget1Finma';

const Widget1Recap = ({ array, finma }) => (
  <div className="card1 widget1-recap">
    <h2>
      <T id="Widget1Recap.title" />
    </h2>
    <RecapSimple array={array} className="recap" />
    <Widget1Finma {...finma} />
  </div>
);

Widget1Recap.propTypes = {};

export default Widget1RecapContainer(Widget1Recap);
