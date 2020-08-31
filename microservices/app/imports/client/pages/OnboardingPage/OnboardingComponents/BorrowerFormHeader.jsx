import React from 'react';

import { borrowerDelete } from 'core/api/borrowers/methodDefinitions';
import ConfirmMethod from 'core/components/ConfirmMethod';
import T from 'core/components/Translation';

const BorrowerFormHeader = ({ index, borrowerId, loanId }) => (
  <div className="flex center-align">
    <h3 className="mr-8">
      <T id="general.borrowerWithIndex" values={{ index: index + 1 }} />
    </h3>

    <ConfirmMethod
      buttonProps={{
        error: true,
        size: 'small',
        label: <T id="general.delete" />,
      }}
      method={() => borrowerDelete.run({ borrowerId, loanId })}
    />
  </div>
);

export const makeBorrowerFormHeader = index => ({
  type: String,
  optional: true,
  uniforms: {
    render: ({ model: { _id: loanId, borrowers = [] } }) => (
      <BorrowerFormHeader
        index={index}
        borrowerId={borrowers[index]?._id}
        loanId={loanId}
      />
    ),
  },
});

export default BorrowerFormHeader;
