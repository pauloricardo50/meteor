import { PROMOTION_LOT_STATUS } from '../../../api/constants';
import colors from '../../../config/colors';

export const getLabelOtherProps = ({ attributedToMe, status }) => {
  switch (status) {
  case PROMOTION_LOT_STATUS.BOOKED:
    return attributedToMe
      ? { suffix: ' pour moi' }
      : { labelOverride: 'Non disponible', colorOverride: colors.warning };
  case PROMOTION_LOT_STATUS.AVAILABLE:
    return {};
  case PROMOTION_LOT_STATUS.SOLD:
    return attributedToMe
      ? { suffix: ' à moi', colorOverride: colors.success }
      : {};
  default:
    return {};
  }
};
