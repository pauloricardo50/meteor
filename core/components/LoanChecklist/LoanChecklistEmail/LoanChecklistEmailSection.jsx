// @flow
import React from 'react';
import LoanChecklistEmailList from './LoanChecklistEmailList';
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
        <LoanChecklistEmailList
          title={property.title}
          labels={property.labels}
          formatMessage={formatMessage}
        />
      )}
      {borrowers.map(borrower => (
        <LoanChecklistEmailList
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
