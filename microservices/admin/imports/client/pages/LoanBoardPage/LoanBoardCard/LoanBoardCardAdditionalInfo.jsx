import React from 'react';

import T from 'core/components/Translation';
import { additionalLoanBoardFields } from '../loanBoardHelpers';

const LoanBoardCardAdditionalInfo = ({ loan, additionalFields }) => {
  const hasAdditionalFields = additionalFields.length > 0;

  if (!hasAdditionalFields) {
    return null;
  }

  return (
    <div>
      <hr />

      {additionalFields.map(i => {
        const { format, label, labelId } = additionalLoanBoardFields.find(
          ({ id }) => id === i,
        );

        const value = format(loan);

        return (
          <span key={i} className="flex mb-8">
            <span className="secondary">{label || <T id={labelId} />}:</span>
            &nbsp;
            <span>{value || '-'}</span>
          </span>
        );
      })}
    </div>
  );
};

export default LoanBoardCardAdditionalInfo;
