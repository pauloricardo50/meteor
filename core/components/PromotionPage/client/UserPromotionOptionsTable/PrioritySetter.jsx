import React from 'react';
import { withProps } from 'recompose';

import {
  increaseOptionPriority,
  reducePriorityOrder,
} from '../../../../api/promotionOptions/methodDefinitions';
import IconButton from '../../../IconButton';

const PrioritySetter = ({
  index,
  length,
  onIncrease,
  onReduce,
  isLoading,
  allowChange,
}) => (
  <div className="priority-setter">
    {index + 1}
    {allowChange && (
      <>
        <IconButton
          type="up"
          onClick={onIncrease}
          disabled={isLoading || index === 0}
          tooltip="Augmenter priorité"
        />

        <IconButton
          type="down"
          onClick={onReduce}
          disabled={isLoading || index === length - 1}
          tooltip="Réduire priorité"
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
