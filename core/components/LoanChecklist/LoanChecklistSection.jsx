// @flow
import React from 'react';

type LoanChecklistSectionProps = {
  missingInformations: Object,
  Component: React.Node,
};

const LoanChecklistSection = ({
  missingInformations: { property = {}, borrowers = [], loan = {} } = {},
  Component,
}: LoanChecklistSectionProps) => (
  <>
    {!!Object.keys(loan).length && (
      <Component title={loan.title} labels={loan.labels} />
    )}
    {!!Object.keys(property).length && (
      <Component title={property.title} labels={property.labels} />
    )}
    {borrowers.map(borrower => (
      <Component
        key={borrower.title}
        title={borrower.title}
        labels={borrower.labels}
      />
    ))}
  </>
);

export default LoanChecklistSection;
