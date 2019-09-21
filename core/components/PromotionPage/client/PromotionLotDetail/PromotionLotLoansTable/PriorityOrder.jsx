// @flow
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { createRoute } from '../../../../../utils/routerUtils';
import Chip from '../../../../Material/Chip';
import Link from '../../../../Link';
import PromotionOptionSolvency from './PromotionOptionSolvency';

type PriorityOrderProps = {};

const getChipColor = ({ currentId, userId, promotionLots }) => {
  const attributedTo = promotionLots[0].attributedTo && promotionLots[0].attributedTo.user._id;
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

const getTooltip = (color) => {
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
}: PriorityOrderProps) => {
  const { priorityOrder = [] } = promotion.$metadata;
  const options = priorityOrder.map(promotionOptionId =>
    promotionOptions.find(({ _id }) => _id === promotionOptionId));

  return (
    <div className="priority-order">
      {options.map(({ _id, name, solvency, promotionLots }) => {
        const chipColor = getChipColor({ currentId, userId, promotionLots });

        return (
          <Link
            to={createRoute(
              '/promotions/:promotionId/promotionLots/:promotionLotId',
              {
                promotionId: promotion._id,
                promotionLotId: promotionLots[0]._id,
              },
            )}
            key={`${_id}${promotionLots[0]._id}`}
            onClick={event => event.stopPropagation()}
          >
            <Tooltip placement="bottom" title={getTooltip(chipColor)}>
              <Chip
                clickable
                label={name}
                className={chipColor}
                icon={<PromotionOptionSolvency solvency={solvency} />}
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
          </Link>
        );
      })}
    </div>
  );
};

export default PriorityOrder;
