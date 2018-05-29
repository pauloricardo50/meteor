import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import RecapSimple from 'core/components/Recap/RecapSimple';
import Widget1RecapContainer from './Widget1RecapContainer';
import Widget1Finma from './Widget1Finma';
import Widget1LenderCount from './Widget1LenderCount';

const Widget1Recap = ({ array, finma }) => (
  <div className="card1 widget1-recap">
    <h3>
      <T id="Widget1Recap.title" />
    </h3>
    <RecapSimple array={array} className="recap" />
    <div className="card-bottom no-responsive-typo-m">
      <Widget1Finma {...finma} />
      <Widget1LenderCount {...finma} />
    </div>
  </div>
);

Widget1Recap.propTypes = {};

export default Widget1RecapContainer(Widget1Recap);
