import React from 'react';
import PropTypes from 'prop-types';

import ExpensesChart from '/imports/ui/components/charts/ExpensesChart';
import Recap from 'core/components/Recap';

const styles = {
  div: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  chart: {
    textAlign: 'center',
    flexGrow: 0,
    width: 400,
  },
};

const StructureRecap = props => {
  return (
    <div style={styles.div}>
      <Recap {...props} arrayName="structure" />
      <div style={styles.chart}>
        <ExpensesChart {...props} />
      </div>
    </div>
  );
};

StructureRecap.propTypes = {};

export default StructureRecap;
