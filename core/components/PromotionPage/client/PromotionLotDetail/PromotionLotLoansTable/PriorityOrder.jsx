import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import Chip from '../../../../Material/Chip';

const getChipColor = ({ currentId, userId, promotionLots }) => {
  const attributedTo =
    promotionLots[0].attributedTo && promotionLots[0].attributedTo.user._id;
  const promotionLotId = promotionLots[0]._id;

  if (attributedTo && attributedTo === userId) {
    return 'success';
  }
  if (attributedTo && attributedTo !== userId) {
    return 'error';
  }
  if (currentId === promotionLotId) {
    return 'primary';
  }

  return '';
};

const getTooltip = color => {
  switch (color) {
    case 'success':
      return 'Ce lot a été attribué à ce client';
    case 'error':
      return "Ce lot a été attribué à quelqu'un d'autre";
    case 'primary':
      return 'Vous êtes sur la page de ce lot';

    default:
      return "Ce lot n'est attribué à personne";
  }
};

const PriorityOrder = ({
  promotion,
  promotionOptions = [],
  currentId,
  userId,
}) => {
  const { priorityOrder = [] } = promotion.$metadata;
  const options = priorityOrder.map(promotionOptionId =>
    promotionOptions.find(({ _id }) => _id === promotionOptionId),
  );

  return (
    <div className="priority-order">
      {options.map(({ _id, name, promotionLots }) => {
        const chipColor = getChipColor({ currentId, userId, promotionLots });

        return (
          <Tooltip key={_id} placement="bottom" title={getTooltip(chipColor)}>
            <Chip label={name} className={chipColor} />
          </Tooltip>
        );
      })}
    </div>
  );
};

export default PriorityOrder;
