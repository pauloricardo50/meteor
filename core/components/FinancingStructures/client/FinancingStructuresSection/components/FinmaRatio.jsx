// @flow
import React from 'react';

import CalculatedValue from './CalculatedValue';
import PercentWithStatus from '../../../../PercentWithStatus/PercentWithStatus';
import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';

type FinmaRatioProps = {
  status: Function,
};

const FinmaRatio = ({ status, ...props }: FinmaRatioProps) => (
  <CalculatedValue {...props}>
    {value => (
      <PercentWithStatus value={value} status={status({ ...props, value })} />
    )}
  </CalculatedValue>
);

export default FinancingStructuresDataContainer({ asArrays: false })(FinmaRatio);
