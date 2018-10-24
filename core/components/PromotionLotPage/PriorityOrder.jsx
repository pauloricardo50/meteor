// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { createRoute } from 'core/utils/routerUtils';

import Chip from 'core/components/Material/Chip';
import Icon from 'core/components/Icon';
import { PRO_PROMOTION_LOT_PAGE } from 'imports/startup/client/proRoutes';

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
  const { priorityOrder = [] } = promotion.$metadata;
  const options = priorityOrder.map(promotionOptionId =>
    promotionOptions.find(({ _id }) => _id === promotionOptionId));
  return (
    <div className="priority-order">
      {options.map(({ _id, name, solvency: solvencyTODO, promotionLots }) => {
        const solvency = Math.random() > 0.3;
        return (
          <Link
            to={createRoute(PRO_PROMOTION_LOT_PAGE, {
              ':promotionId': promotion._id,
              ':promotionLotId': promotionLots[0]._id,
            })}
            key={`${_id}${promotionLots[0]._id}`}
          >
            <Chip
              label={name}
              key={_id}
              className={getChipColor({
                currentId,
                promotionOptionId: _id,
                userId,
                promotionLots,
              })}
              icon={
                <Icon type={solvency ? 'check' : 'close'} className="icon" />
              }
              style={{ cursor: 'pointer' }}
            />
          </Link>
        );
      })}
    </div>
  );
};
export default PriorityOrder;
