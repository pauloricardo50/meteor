// @flow
import React from 'react';

import Calculator from '../../utils/Calculator';
import T from '../Translation';
import LoanChecklistDocuments from './LoanChecklistDocuments';
import LoanChecklistFields from './LoanChecklistFields';

type LoanChecklistProps = {};

const LoanChecklist = ({ loan }: LoanChecklistProps) => (
  <div className="loan-checklist">
    <div className="loan-checklist-section">
      <h3>
        <T id="LoanChecklist.missingFields" />
      </h3>
      <span className="loan-checklist-list">
        <h4>{loan.structure.property.address1}</h4>
        <LoanChecklistFields
          ids={Calculator.getMissingPropertyFields({ loan })}
        />
      </span>
      {loan.borrowers.map(borrower => (
        <span className="loan-checklist-list" key={borrower._id}>
          <h4>{borrower.name}</h4>
          <LoanChecklistFields
            ids={Calculator.getMissingBorrowerFields({ borrowers: borrower })}
          />
        </span>
      ))}
    </div>

    <div className="loan-checklist-section">
      <h3>
        <T id="LoanChecklist.missingDocuments" />
      </h3>
      <span className="loan-checklist-list">
        <h4>{loan.structure.property.address1}</h4>
        <LoanChecklistDocuments
          ids={Calculator.getMissingPropertyDocuments({ loan })}
        />
      </span>
      {loan.borrowers.map(borrower => (
        <span className="loan-checklist-list" key={borrower._id}>
          <h4>{borrower.name}</h4>
          <LoanChecklistDocuments
            ids={Calculator.getMissingBorrowerDocuments({
              borrowers: borrower,
            })}
          />
        </span>
      ))}
    </div>
  </div>
);

export default LoanChecklist;
