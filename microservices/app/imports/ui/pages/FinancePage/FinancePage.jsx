import React from 'react';

import Page from '/imports/ui/components/Page';
import AmortizationTool from './AmortizationTool';

const FinancePage = props => (
  <Page id="FinancePage">
    <AmortizationTool {...props} />
  </Page>
);

export default FinancePage;
