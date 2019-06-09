// @flow
import React from 'react';

import Calculator from '../../utils/Calculator';
import T from '../Translation';
import LoanChecklistList from './LoanChecklistList';

type LoanChecklistDocumentsProps = {};

const makeLabelOverrider = doc => (id) => {
  const additionalDocument = doc.additionalDocuments.find(({ id: documentId }) => documentId === id);

  if (additionalDocument) {
    return additionalDocument.label;
  }

  return false;
};

const LoanChecklistDocuments = ({
  loan,
  displayPropertyChecklist,
}: LoanChecklistDocumentsProps) => {
  const property = Calculator.selectProperty({ loan });

  return (
    <div className="loan-checklist-section">
      <h3>
        <T id="LoanChecklist.missingDocuments" />
      </h3>
      {displayPropertyChecklist && (
        <LoanChecklistList
          title={(property && property.address1) || <T id="general.property" />}
          ids={Calculator.getMissingPropertyDocuments({ loan })}
          intlPrefix="files"
          labelOverrider={makeLabelOverrider(property)}
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
          labelOverrider={makeLabelOverrider(borrower)}
        />
      ))}
    </div>
  );
};

export default LoanChecklistDocuments;
