import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import Chip from '../../../../Material/Chip';
import StickyPopover from '../../../../StickyPopover';
import T from '../../../../Translation';

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

const makeMapChip = (currentPromotionLotId, loanId) => ({
  _id,
  name,
  promotionLots,
}) => {
  const chipColor = getChipColor({
    currentPromotionLotId,
    promotionLots,
    loanId,
  });

  return (
    <Tooltip
      key={_id}
      placement="bottom"
      title={getTooltip(chipColor)}
      PopperProps={{
        // Above the StickyPopover
        style: { zIndex: 10000 },
      }}
    >
      <Chip label={name} className={chipColor} />
    </Tooltip>
  );
};

const PriorityOrder = ({
  promotionOptions = [],
  currentPromotionLotId,
  loanId,
}) => {
  const sortedPromotionOptions = promotionOptions.sort(
    ({ priorityOrder: A }, { priorityOrder: B }) => A - B,
  );

  const firstThree = sortedPromotionOptions.slice(0, 2);
  const rest = sortedPromotionOptions.slice(2);

  return (
    <div className="priority-order">
      {firstThree.map(makeMapChip(currentPromotionLotId, loanId))}

      {rest?.length ? (
        <StickyPopover
          component={
            <div className="priority-order flex-col">
              {rest.map(makeMapChip(currentPromotionLotId, loanId))}
            </div>
          }
        >
          <span style={{ alignSelf: 'center' }}>
            <T
              values={{ count: rest.length }}
              defaultMessage="et {count} de plus"
            />
          </span>
        </StickyPopover>
      ) : null}
    </div>
  );
};

export default PriorityOrder;
