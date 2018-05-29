import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';

import Widget1FinmaLine from './Widget1FinmaLine';

const Widget1Finma = ({ borrowRule, incomeRule }) => (
  <div className="widget1-finma">
    <h4>
      <T id="Widget1Finma.title" />
    </h4>
    <Widget1FinmaLine {...borrowRule} id="borrowRule" />
    <Widget1FinmaLine {...incomeRule} id="incomeRule" />
  </div>
);

Widget1Finma.propTypes = {};

export default Widget1Finma;
