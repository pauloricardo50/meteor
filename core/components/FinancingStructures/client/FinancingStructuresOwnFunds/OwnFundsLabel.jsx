// @flow
import React from 'react';

import T from 'core/components/Translation';
import { toMoney } from '../../../../utils/conversionFunctions';
import FinancingStructuresDataContainer from '../containers/FinancingStructuresDataContainer';

type OwnFundsLabelProps = {};

const OwnFundsLabel = ({ id, labelValue, ...data }: OwnFundsLabelProps) => {
  const availableAmount = labelValue(data);
  return (
    <div className="own-funds-label">
      <T id={`FinancingStructures.${id}`} />
      <div className="value">
        Dispo:
        <span className="chf">CHF</span>
        <span className="primary">{toMoney(availableAmount)}</span>
      </div>
    </div>
  );
};

export default FinancingStructuresDataContainer({ asArrays: true })(OwnFundsLabel);
