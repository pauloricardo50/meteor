// @flow
import React from 'react';

import Chip from 'core/components/Material/Chip';
import Icon from 'core/components/Icon';

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
      {options.map(({ _id, name, solvency }) => (
        <Chip
          label={name}
          key={_id}
          className={_id === currentId ? 'primary' : ''}
          icon={<Icon type={solvency ? 'check' : 'close'} className="icon" />}
        />
      ))}
    </div>
  );
};

export default PriorityOrder;
