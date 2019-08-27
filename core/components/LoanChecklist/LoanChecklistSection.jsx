// @flow
import React from 'react';

import T from '../Translation';
import LoanChecklistList from './LoanChecklistList';

type LoanChecklistSectionProps = {
  missingInformations: Object,
  label: React.ReactNode,
};

const LoanChecklistSection = (props: LoanChecklistSectionProps) => {
  const {
    missingInformations: { property = {}, borrowers = [] } = {},
    label,
  } = props;

  return (
    <div className="loan-checklist-section">
      <h3>{label}</h3>
      {!!Object.keys(property).length && (
        <LoanChecklistList title={property.title} labels={property.labels} />
      )}
      {borrowers.map(borrower => (
        <LoanChecklistList
          key={borrower.title}
          title={borrower.title}
          labels={borrower.labels}
        />
      ))}
    </div>
  );
};

export default LoanChecklistSection;
