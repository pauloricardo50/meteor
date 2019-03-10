// @flow
import React from 'react';

import Calculator from '../../utils/Calculator';
import T from '../Translation';
import LoanChecklistList from './LoanChecklistList';

type LoanChecklistFieldsProps = {};

const LoanChecklistFields = ({
  loan,
  displayPropertyChecklist,
}: LoanChecklistFieldsProps) => {
  const property = Calculator.selectProperty({ loan });
  return (
    <div className="loan-checklist-section">
      <h3>
        <T id="LoanChecklist.missingFields" />
      </h3>
      {displayPropertyChecklist && (
        <LoanChecklistList
          title={(property && property.address1) || <T id="general.property" />}
          ids={Calculator.getMissingPropertyFields({ loan })}
          intlPrefix="Forms"
        />
      )}
      {loan.borrowers.map((borrower, index) => (
        <LoanChecklistList
          key={borrower._id}
          title={
            borrower.name || (
              <T id="general.borrowerWithIndex" values={{ index: index + 1 }} />
            )
          }
          ids={Calculator.getMissingBorrowerFields({ borrowers: borrower })}
          intlPrefix="Forms"
        />
      ))}
    </div>
  );
};

export default LoanChecklistFields;
