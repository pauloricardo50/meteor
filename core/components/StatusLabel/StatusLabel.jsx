// @flow
import React from 'react';

import colors from '../../config/colors';
import {
  PROMOTION_STATUS,
  PROMOTIONS_COLLECTION,
  PROMOTION_LOTS_COLLECTION,
  PROMOTION_LOT_STATUS,
  PROMOTION_LOT_REDUCED_STATUS,
  TASKS_COLLECTION,
  TASK_STATUS,
  LOANS_COLLECTION,
  LOAN_STATUS,
  LENDERS_COLLECTION,
  LENDER_STATUS,
} from '../../api/constants';
import T from '../Translation';

type StatusLabelProps = {};

const getStatusColor = (status, collection) => {
  switch (collection) {
  case LOANS_COLLECTION:
    return {
      [LOAN_STATUS.TEST]: colors.warning,
      [LOAN_STATUS.LEAD]: colors.secondary,
      [LOAN_STATUS.ONGOING]: colors.primary,
      [LOAN_STATUS.PENDING]: colors.warning,
      [LOAN_STATUS.CLOSING]: colors.tertiary,
      [LOAN_STATUS.BILLING]: colors.success,
      [LOAN_STATUS.FINALIZED]: colors.success,
      [LOAN_STATUS.UNSUCCESSFUL]: colors.error,
    }[status];

  case PROMOTIONS_COLLECTION:
    return {
      [PROMOTION_STATUS.CANCELLED]: colors.warning,
      [PROMOTION_STATUS.FINISHED]: colors.error,
      [PROMOTION_STATUS.OPEN]: colors.success,
      [PROMOTION_STATUS.PREPARATION]: colors.primary,
    }[status];

  case PROMOTION_LOTS_COLLECTION:
    return {
      [PROMOTION_LOT_STATUS.AVAILABLE]: colors.success,
      [PROMOTION_LOT_STATUS.BOOKED]: colors.primary,
      [PROMOTION_LOT_STATUS.SOLD]: colors.error,
      [PROMOTION_LOT_REDUCED_STATUS.SOLD_TO_ME]: colors.tertiary,
      [PROMOTION_LOT_REDUCED_STATUS.BOOKED_FOR_ME]: colors.primary,
      [PROMOTION_LOT_REDUCED_STATUS.NOT_AVAILABLE]: colors.warning,
    }[status];

  case TASKS_COLLECTION:
    return {
      [TASK_STATUS.ACTIVE]: colors.primary,
      [TASK_STATUS.COMPLETED]: colors.success,
      [TASK_STATUS.CANCELLED]: colors.error,
    }[status];

  case LENDERS_COLLECTION:
    return {
      [LENDER_STATUS.TO_BE_CONTACTED]: colors.warning,
      [LENDER_STATUS.CONTACTED]: colors.primary,
      [LENDER_STATUS.OFFER_RECEIVED]: colors.success,
      [LENDER_STATUS.TO_EXCLUDE]: colors.error,
    }[status];

  default:
    break;
  }
};

const StatusLabel = ({
  status,
  collection,
  suffix = '',
  label = null,
  color = null,
}: StatusLabelProps) => (
  <div
    className="status-label"
    style={{
      backgroundColor: color || getStatusColor(status, collection),
    }}
  >
    <span>
      {label || <T id={`Forms.status.${status}`} />}
      {suffix}
    </span>
  </div>
);

export default StatusLabel;
