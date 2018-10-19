import { PROMOTION_LOT_STATUS } from '../../../api/constants';

export const getLabelSuffix = ({ attributedToMe, status }) => {
  if (!attributedToMe) {
    return '';
  }

  return `${status === PROMOTION_LOT_STATUS.BOOKED ? ' pour' : ' à'} moi`;
};
