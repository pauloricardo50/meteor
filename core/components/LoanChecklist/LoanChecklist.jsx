// @flow
import React from 'react';

import LoanChecklistFields from './LoanChecklistFields';
import LoanChecklistDocuments from './LoanChecklistDocuments';

type LoanChecklistProps = {};

const LoanChecklist = ({ loan }: LoanChecklistProps) => {
  const displayPropertyChecklist = !loan.hasPromotion;
  return (
    <div className="loan-checklist">
      <LoanChecklistFields
        loan={loan}
        displayPropertyChecklist={displayPropertyChecklist}
      />
      <LoanChecklistDocuments
        loan={loan}
        displayPropertyChecklist={displayPropertyChecklist}
      />
    </div>
  );
};

export default LoanChecklist;
