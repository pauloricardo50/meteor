// @flow
import React from 'react';

import { compose } from 'recompose';
import CalculatedValue from './CalculatedValue';
import PercentWithStatus from '../../../../PercentWithStatus/PercentWithStatus';
import FinancingDataContainer from '../../containers/FinancingDataContainer';

type FinmaRatioProps = {
  status: Function,
  tooltip?: String,
  id: String,
};

const FinmaRatio = ({ status, tooltip, id, ...props }: FinmaRatioProps) => (
  <CalculatedValue {...props}>
    {value => (
      <PercentWithStatus
        value={value}
        status={status({ ...props, value })}
        tooltip={tooltip}
        id={id}
      />
    )}
  </CalculatedValue>
);

export default compose(
  FinancingDataContainer,
  React.memo,
)(FinmaRatio);
