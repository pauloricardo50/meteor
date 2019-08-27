// @flow
import React from 'react';
import EmailLoanChecklist from './EmailLoanChecklist';
import LoanChecklistEmailTable from './LoanChecklistEmailTable';

type LoanChecklistEmailSectionProps = {
  missingInformations: Object,
  label: String,
};

const LoanChecklistEmailSection = (props: LoanChecklistEmailSectionProps) => {
  const {
    missingInformations: { property = {}, borrowers = [] } = {},
    label,
    formatMessage,
  } = props;

  return (
    <>
      <LoanChecklistEmailTable
        columns={[
          <h3 className="section-title" key={label}>
            {label}
          </h3>,
        ]}
      />
      {!!Object.keys(property).length && (
        <EmailLoanChecklist
          title={property.title}
          labels={property.labels}
          formatMessage={formatMessage}
        />
      )}
      {borrowers.map(borrower => (
        <EmailLoanChecklist
          key={borrower.title}
          title={borrower.title}
          labels={borrower.labels}
          formatMessage={formatMessage}
        />
      ))}
    </>
  );
};

export default LoanChecklistEmailSection;
