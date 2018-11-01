// @flow
import React from 'react';

import Calculator from '../../utils/Calculator';
import T from '../Translation';
import LoanChecklistList from './LoanChecklistList';

type LoanChecklistDocumentsProps = {};

const LoanChecklistDocuments = ({
  loan,
  displayPropertyChecklist,
}: LoanChecklistDocumentsProps) => (
  <div className="loan-checklist-section">
    <h3>
      <T id="LoanChecklist.missingDocuments" />
    </h3>
    {displayPropertyChecklist && (
      <LoanChecklistList
        title={loan.structure.property.address1 || <T id="general.property" />}
        ids={Calculator.getMissingPropertyDocuments({ loan })}
        intlPrefix="files"
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
        ids={Calculator.getMissingBorrowerDocuments({
          loan,
          borrowers: borrower,
        })}
        intlPrefix="files"
      />
    ))}
  </div>
);

export default LoanChecklistDocuments;
