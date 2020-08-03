import React from 'react';
import { withProps } from 'recompose';

import {
  increaseOptionPriority,
  reducePriorityOrder,
} from '../../../../api/promotionOptions/methodDefinitions';
import IconButton from '../../../IconButton';

const PrioritySetter = ({
  priorityOrder,
  length,
  onIncrease,
  onReduce,
  isLoading,
  allowChange,
}) => (
  <div className="priority-setter" onClick={e => e.stopPropagation()}>
    <span>{priorityOrder + 1}</span>
    {allowChange && (
      <>
        <IconButton
          type="up"
          onClick={onIncrease}
          disabled={isLoading || priorityOrder === 0}
          tooltip="Augmenter priorité"
          className="ml-8"
          size="small"
        />

        <IconButton
          type="down"
          onClick={onReduce}
          disabled={isLoading || priorityOrder === length - 1}
          tooltip="Réduire priorité"
          size="small"
          className="ml-8"
        />
      </>
    )}
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
