import React from 'react';

import Page from '../../components/Page';
import AmortizationTool from './AmortizationTool';

const FinancePage = props => (
  <Page id="FinancePage">
    <AmortizationTool {...props} />
  </Page>
);

export default FinancePage;
