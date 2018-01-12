import React from 'react';
import PropTypes from 'prop-types';

import Page from '/imports/ui/components/Page';
import AmortizationTool from './AmortizationTool';

const styles = {
  div: {
    marginBottom: 15,
  },
};

const FinancePage = props => (
  <Page id="FinancePage">
    {/* <div className="mask1" style={styles.div}>
        <ExpensesChartInterests {...props} />
      </div> */}
    <AmortizationTool {...props} />
  </Page>
);

FinancePage.propTypes = {};

export default FinancePage;
