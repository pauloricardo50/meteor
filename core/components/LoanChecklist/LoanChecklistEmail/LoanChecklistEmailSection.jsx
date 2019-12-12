// @flow
import React from 'react';

import LoanChecklistSection from '../LoanChecklistSection';
import EmailLoanChecklist from './EmailLoanChecklist';
import LoanChecklistEmailTable from './LoanChecklistEmailTable';

type LoanChecklistEmailSectionProps = {
  missingInformations: Object,
  label: String,
};

const LoanChecklistEmailSection = (props: LoanChecklistEmailSectionProps) => {
  const { missingInformations = {}, label } = props;

  return (
    <>
      <LoanChecklistEmailTable
        columns={[
          <h3 className="section-title" key={label}>
            {label}
          </h3>,
        ]}
      />

      <LoanChecklistSection
        missingInformations={missingInformations}
        Component={EmailLoanChecklist}
      />
    </>
  );
};

export default LoanChecklistEmailSection;
