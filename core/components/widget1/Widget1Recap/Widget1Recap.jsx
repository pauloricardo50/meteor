import React from 'react';
import PropTypes from 'prop-types';

import RecapSimple from '../../Recap/RecapSimple';
import T from '../../Translation';
import Widget1Finma from './Widget1Finma';
import Widget1LenderCount from './Widget1LenderCount';
import Widget1RecapContainer from './Widget1RecapContainer';

const Widget1Recap = ({ array, finma }) => (
  <div className="card1 widget1-recap">
    <div className="card-top">
      <h3>
        <T id="Widget1Recap.title" />
      </h3>
      <div className="recap-wrapper">
        <RecapSimple array={array} className="recap" />
      </div>
    </div>
    <div className="card-bottom no-responsive-typo-m">
      <Widget1Finma {...finma} />
      <Widget1LenderCount {...finma} />
    </div>
  </div>
);

Widget1Recap.propTypes = {
  array: PropTypes.array.isRequired,
  finma: PropTypes.object.isRequired,
};

export default Widget1RecapContainer(Widget1Recap);
