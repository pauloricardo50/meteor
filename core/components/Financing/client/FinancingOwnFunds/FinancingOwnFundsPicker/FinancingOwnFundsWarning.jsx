// @flow
import React from 'react';

import { toMoney } from '../../../../../utils/conversionFunctions';
import T from '../../../../Translation';

type FinancingOwnFundsWarningProps = {};

const FinancingOwnFundsWarning = ({
  borrowers,
  type,
  borrowerId,
  value,
  otherValueOfTypeAndBorrower,
}: FinancingOwnFundsWarningProps) => (
  <p>
    <T
      id="FinancingOwnFundsPickerForm.warning"
      values={{
        name: (
          <b>{borrowers.find(({ _id }) => _id === borrowerId).firstName}</b>
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
