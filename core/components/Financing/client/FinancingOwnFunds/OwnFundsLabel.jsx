import React from 'react';

import { toMoney } from '../../../../utils/conversionFunctions';
import T from '../../../Translation';
import FinancingDataContainer from '../containers/FinancingDataContainer';

const OwnFundsLabel = ({ id, labelValue, ...data }) => {
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

export default FinancingDataContainer(OwnFundsLabel);
