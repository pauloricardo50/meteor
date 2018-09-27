// @flow
import React from 'react';

import { toMoney } from '../../../../../utils/conversionFunctions';
import T from '../../../../Translation';

type FinancingOwnFundsWarningProps = {};

const FinancingOwnFundsWarning = ({
  borrower: { firstName },
  borrowerIndex,
  type,
  value,
  otherValueOfTypeAndBorrower,
}: FinancingOwnFundsWarningProps) => (
  <p>
    <T
      id="FinancingOwnFundsPickerForm.warning"
      values={{
        name: (
          <b>
            {firstName || (
              <T
                id="general.borrowerWithIndex"
                values={{ index: borrowerIndex + 1 }}
              />
            )}
          </b>
        ),
        value: (
          <b className="primary">
            {toMoney(otherValueOfTypeAndBorrower + value)}
          </b>
        ),
        type: (
          <b>
            <T id={`Forms.${type}`} />
          </b>
        ),
      }}
    />
  </p>
);

export default FinancingOwnFundsWarning;
