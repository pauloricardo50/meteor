// @flow
import React from 'react';

import T from 'core/components/Translation';
import { toMoney } from '../../../../utils/conversionFunctions';
import FinancingDataContainer from '../containers/FinancingDataContainer';

type OwnFundsLabelProps = {};

const OwnFundsLabel = ({ id, labelValue, ...data }: OwnFundsLabelProps) => {
  const availableAmount = labelValue(data);
  return (
    <div className="own-funds-label">
      <T id={`Financing.${id}`} />
      <div className="value">
        <T id="Financing.OwnFundsLabel.available" />
        <span className="chf">CHF</span>
        <span className="primary">{toMoney(availableAmount)}</span>
      </div>
    </div>
  );
};

export default FinancingDataContainer({ asArrays: true })(OwnFundsLabel);
