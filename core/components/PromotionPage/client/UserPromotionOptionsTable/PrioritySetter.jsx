// @flow
import React from 'react';

import { withProps } from 'recompose';
import IconButton from '../../../IconButton';
import { increaseOptionPriority, reducePriorityOrder } from '../../../../api';

type PrioritySetterProps = {};

const PrioritySetter = ({
  index,
  length,
  onIncrease,
  onReduce,
  isLoading,
}: PrioritySetterProps) => (
  <div className="priority-setter">
    {index + 1}
    <IconButton
      type="up"
      onClick={onIncrease}
      disabled={isLoading || index === 0}
    />

    <IconButton
      type="down"
      onClick={onReduce}
      disabled={isLoading || index === length - 1}
    />
  </div>
);

export default withProps(({ promotionOptionId, setLoading }) => ({
  onIncrease: () => {
    setLoading(true);
    return increaseOptionPriority
      .run({ promotionOptionId })
      .finally(() => setLoading(false));
  },
  onReduce: () => {
    setLoading(true);
    return reducePriorityOrder
      .run({ promotionOptionId })
      .finally(() => setLoading(false));
  },
}))(PrioritySetter);
