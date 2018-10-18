// @flow
import React from 'react';

import Chip from 'core/components/Material/Chip';
import Icon from 'core/components/Icon';

type PriorityOrderProps = {};

const getChipColor = ({
  currentId,
  promotionOptionId,
  userId,
  promotionLots,
}) => {
  const attributedTo = promotionLots[0].attributedTo && promotionLots[0].attributedTo.user._id;
  if (attributedTo === userId) {
    return 'success';
  }
  if (attributedTo && attributedTo !== userId) {
    return 'error';
  }
  if (currentId === promotionOptionId) {
    return 'primary';
  }
  return '';
};

const PriorityOrder = ({
  promotion,
  promotionOptions = [],
  currentId,
  userId,
}: PriorityOrderProps) => {
  const { priorityOrder } = promotion.$metadata;
  const options = priorityOrder.map(promotionOptionId =>
    promotionOptions.find(({ _id }) => _id === promotionOptionId));
  console.log('promotionOptions', promotionOptions);
  return (
    <div className="priority-order">
      {options.map(({ _id, name, solvency, promotionLots }) => (
        <Chip
          label={name}
          key={_id}
          className={getChipColor({
            currentId,
            promotionOptionId: _id,
            userId,
            promotionLots,
          })}
          icon={<Icon type={solvency ? 'check' : 'close'} className="icon" />}
        />
      ))}
    </div>
  );
};

export default PriorityOrder;
