import React from 'react';

import Page from '/imports/ui/components/Page';
import AmortizationTool from './AmortizationTool';

const FinancePage = props => (
  <Page sectionId="finance-page" id="FinancePage">
    <AmortizationTool {...props} />
  </Page>
);

export default FinancePage;
