// @flow
import React from 'react';

import colors from '../../config/colors';
import { PROMOTION_STATUS } from '../../api/constants';
import T from '../Translation';

type StatusLabelProps = {};

const getStatusColor = (status, collection) => {
  switch (collection) {
  case 'promotions':
    return {
      [PROMOTION_STATUS.CANCELLED]: colors.error,
      [PROMOTION_STATUS.FINISHED]: colors.success,
      [PROMOTION_STATUS.OPEN]: colors.success,
      [PROMOTION_STATUS.PREPARATION]: colors.primary,
    }[status];

  default:
    break;
  }
};

const StatusLabel = ({ status, collection }: StatusLabelProps) => (
  <div
    className="status-label"
    style={{ backgroundColor: getStatusColor(status, collection) }}
  >
    <T id={`Forms.status.${status}`} />
  </div>
);

export default StatusLabel;
