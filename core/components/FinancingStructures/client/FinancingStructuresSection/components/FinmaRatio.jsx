// @flow
import React from 'react';

import CalculatedValue from './CalculatedValue';
import PercentWithStatus from '../../../../PercentWithStatus/PercentWithStatus';

type FinmaRatioProps = {};

const FinmaRatio = ({ status, ...props }: FinmaRatioProps) => (
  <CalculatedValue {...props}>
    {value => <PercentWithStatus value={value} status={status} />}
  </CalculatedValue>
);

export default FinmaRatio;
