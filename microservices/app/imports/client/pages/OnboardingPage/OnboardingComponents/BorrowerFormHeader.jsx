import React from 'react';

import { borrowerDelete } from 'core/api/borrowers/methodDefinitions';
import ConfirmMethod from 'core/components/ConfirmMethod';
import T from 'core/components/Translation';

const BorrowerFormHeader = ({ index, borrowerId, loanId, borrowerCount }) => (
  <div className="flex center-align">
    <h3 className="mt-0 mb-0 mr-8">
      <T id="general.borrowerWithIndex" values={{ index: index + 1 }} />
    </h3>

    {borrowerCount >= 2 && (
      <ConfirmMethod
        buttonProps={{
          error: true,
          size: 'small',
          label: <T id="general.delete" />,
        }}
        method={() => borrowerDelete.run({ borrowerId, loanId })}
      />
    )}
  </div>
);

export const makeBorrowerFormHeader = ({
  index,
  borrowerCount,
  loanId,
  borrowerIds,
}) => ({
  type: String,
  optional: true,
  maxCount: borrowerCount,
  uniforms: {
    render: ({ maxCount }) => (
      <BorrowerFormHeader
        key={borrowerCount}
        index={index}
        borrowerId={borrowerIds[index]}
        loanId={loanId}
        borrowerCount={maxCount} // Weird hack to make this component reset
      />
    ),
  },
});
export default BorrowerFormHeader;
