// @flow
import React from 'react';

import Chip from 'core/components/Material/Chip';

type PriorityOrderProps = {};

const PriorityOrder = ({
  promotion,
  promotionOptions = [],
  currentId,
}: PriorityOrderProps) => {
  const { priorityOrder } = promotion.$metadata;
  const options = priorityOrder.map(promotionOptionId =>
    promotionOptions.find(({ _id }) => _id === promotionOptionId));
  return (
    <div className="priority-order">
      {options.map(({ _id, name }) => (
        <Chip
          label={name}
          key={_id}
          className={_id === currentId ? 'primary' : ''}
        />
      ))}
    </div>
  );
};

export default PriorityOrder;
