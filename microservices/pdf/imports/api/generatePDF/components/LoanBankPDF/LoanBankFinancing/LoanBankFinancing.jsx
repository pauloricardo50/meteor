// @flow
import React from 'react';
import { T } from 'core/components/Translation/Translation';

type LoanBankFinancingProps = {
  structures: Array<Object>,
};

const LoanBankFinancing = ({ structures }: LoanBankFinancingProps) => (
  <div className="loan-bank-pdf-financing">
    <h3 className="loan-bank-pdf-section-title">
      <T id="PDF.sectionTitle.financing" />
    </h3>
    <div className="loan-bank-pdf-project-recap">
      {JSON.stringify(structures, null, 2)}
    </div>
  </div>
);

export default LoanBankFinancing;
