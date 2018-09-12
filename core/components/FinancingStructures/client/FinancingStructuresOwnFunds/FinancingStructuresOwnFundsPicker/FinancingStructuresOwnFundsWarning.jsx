// @flow
import React from 'react';

import { toMoney } from '../../../../../utils/conversionFunctions';
import T from '../../../../Translation';

type FinancingStructuresOwnFundsWarningProps = {};

const FinancingStructuresOwnFundsWarning = ({
  borrowers,
  type,
  borrowerId,
  value,
  otherValueOfTypeAndBorrower,
}: FinancingStructuresOwnFundsWarningProps) => (
  <p>
    <T
      id="FinancingStructuresOwnFundsPickerForm.warning"
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

export default FinancingStructuresOwnFundsWarning;
