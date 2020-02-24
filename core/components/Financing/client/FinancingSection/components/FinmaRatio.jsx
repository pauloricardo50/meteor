import React from 'react';
import { compose } from 'recompose';

import PercentWithStatus from '../../../../PercentWithStatus/PercentWithStatus';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import CalculatedValue from './CalculatedValue';

const FinmaRatio = ({ status, tooltip, id, ...props }) => (
  <CalculatedValue {...props}>
    {value => (
      <PercentWithStatus
        value={value}
        status={
          typeof status === 'function' ? status({ ...props, value }) : status
        }
        tooltip={tooltip}
        id={id}
      />
    )}
  </CalculatedValue>
);

export default compose(FinancingDataContainer, React.memo)(FinmaRatio);
