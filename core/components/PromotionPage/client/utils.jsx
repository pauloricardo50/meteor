import React from 'react';
import { PROMOTION_LOT_STATUS } from '../../../api/constants';
import colors from '../../../config/colors';
import T from '../../Translation';

export const getLabelOtherProps = ({ attributedToMe, status }) => {
  switch (status) {
  case PROMOTION_LOT_STATUS.BOOKED:
    return attributedToMe
      ? { suffix: <T id="Forms.status.suffix.forMe" /> }
      : {
        label: <T id="Forms.status.NOT_AVAILABLE" />,
        color: colors.warning,
      };
  case PROMOTION_LOT_STATUS.AVAILABLE:
    return {};
  case PROMOTION_LOT_STATUS.SOLD:
    return attributedToMe
      ? {
        suffix: <T id="Forms.status.suffix.toMe" />,
        color: colors.success,
      }
      : {};
  default:
    return {};
  }
};
