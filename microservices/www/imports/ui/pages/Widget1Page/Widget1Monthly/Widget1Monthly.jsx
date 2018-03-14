import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import DonutChart from 'core/components/charts/DonutChart';
import Widget1MonthlyContainer from './Widget1MonthlyContainer';

const Widget1Monthly = ({ data, total }) => (
  <div className="card1 widget1-monthly">
    <h2>
      <T id="Widget1Monthly.title" />
    </h2>
    <DonutChart data={data} intlPrefix="Widget1Monthly" />
  </div>
);

Widget1Monthly.propTypes = {
  data: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
};

export default Widget1MonthlyContainer(Widget1Monthly);
