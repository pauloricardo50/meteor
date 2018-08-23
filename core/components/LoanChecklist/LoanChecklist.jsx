// @flow
import React from 'react';

import Calculator from '../../utils/Calculator';
import T from '../Translation';
import LoanChecklistList from './LoanChecklistList';

type LoanChecklistProps = {};

const LoanChecklist = ({ loan }: LoanChecklistProps) => (
  <div className="loan-checklist">
    <div className="loan-checklist-section">
      <h3>
        <T id="LoanChecklist.missingFields" />
      </h3>
      <LoanChecklistList
        title={loan.structure.property.address1}
        ids={Calculator.getMissingPropertyFields({ loan })}
        intlPrefix="Forms"
      />
      {loan.borrowers.map(borrower => (
        <LoanChecklistList
          key={borrower._id}
          title={borrower.name}
          ids={Calculator.getMissingBorrowerFields({ borrowers: borrower })}
          intlPrefix="Forms"
        />
      ))}
    </div>

    <div className="loan-checklist-section">
      <h3>
        <T id="LoanChecklist.missingDocuments" />
      </h3>
      <LoanChecklistList
        title={loan.structure.property.address1}
        ids={Calculator.getMissingPropertyDocuments({ loan })}
        intlPrefix="files"
      />
      {loan.borrowers.map(borrower => (
        <LoanChecklistList
          key={borrower._id}
          title={borrower.name}
          ids={Calculator.getMissingBorrowerDocuments({ borrowers: borrower })}
          intlPrefix="files"
        />
      ))}
    </div>
  </div>
);

export default LoanChecklist;
