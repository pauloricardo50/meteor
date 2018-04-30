import React from 'react';
import PropTypes from 'prop-types';

import ExpensesChart from 'core/components/charts/ExpensesChart';
import Recap from 'core/components/Recap';

const StructureRecap = props => (
  <div className="structure-page-recap">
    <Recap {...props} arrayName="structure" />
    <div className="structure-page-recap-chart">
      <ExpensesChart {...props} />
    </div>
  </div>
);

StructureRecap.propTypes = {};

export default StructureRecap;
