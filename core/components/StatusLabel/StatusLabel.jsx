// @flow
import React from 'react';

import colors from '../../config/colors';
import {
  PROMOTION_STATUS,
  PROMOTIONS_COLLECTION,
  PROMOTION_LOTS_COLLECTION,
  PROMOTION_LOT_STATUS,
} from '../../api/constants';
import T from '../Translation';

type StatusLabelProps = {};

const getStatusColor = (status, collection) => {
  switch (collection) {
  case PROMOTIONS_COLLECTION:
    return {
      [PROMOTION_STATUS.CANCELLED]: colors.error,
      [PROMOTION_STATUS.FINISHED]: colors.success,
      [PROMOTION_STATUS.OPEN]: colors.success,
      [PROMOTION_STATUS.PREPARATION]: colors.primary,
    }[status];

  case PROMOTION_LOTS_COLLECTION:
    return {
      [PROMOTION_LOT_STATUS.AVAILABLE]: colors.success,
      [PROMOTION_LOT_STATUS.BOOKED]: colors.primary,
      [PROMOTION_LOT_STATUS.SOLD]: colors.error,
    }[status];

  default:
    break;
  }
};

const StatusLabel = ({ status, collection, suffix = '' }: StatusLabelProps) => (
  <div
    className="status-label"
    style={{ backgroundColor: getStatusColor(status, collection) }}
  >
    <span>
      <T id={`Forms.status.${status}`} />
      {suffix}
    </span>
  </div>
);

export default StatusLabel;
