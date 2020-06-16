import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import Chip from '../../../../Material/Chip';

const getChipColor = ({ currentPromotionLotId, promotionLots, loanId }) => {
  const attributedTo = promotionLots[0]?.attributedToLink?._id;
  const isAttributedToUser = attributedTo === loanId;
  const promotionLotId = promotionLots[0]._id;
  const isCurrent = currentPromotionLotId === promotionLotId;

  if (isAttributedToUser) {
    return 'success';
  }
  if (attributedTo && !isAttributedToUser) {
    return 'error';
  }
  if (isCurrent) {
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
  promotionOptions = [],
  currentPromotionLotId,
  loanId,
}) => {
  const sortedPromotionOptions = promotionOptions.sort(
    ({ priorityOrder: A }, { priorityOrder: B }) => A - B,
  );

  return (
    <div className="priority-order">
      {sortedPromotionOptions.map(({ _id, name, promotionLots }) => {
        const chipColor = getChipColor({
          currentPromotionLotId,
          promotionLots,
          loanId,
        });

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
