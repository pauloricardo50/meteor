import { withProps } from 'recompose';

import {
  bookPromotionLot,
  cancelPromotionLotBooking,
  sellPromotionLot,
} from '../../../api';
import {
  isAllowedToBookPromotionLotToCustomer,
  isAllowedToSellPromotionLotToCustomer,
} from '../../../api/security/clientSecurityHelpers';

const makePermissions = ({ currentUser, promotion, customerOwnerType }) => ({
  canBookLot: isAllowedToBookPromotionLotToCustomer({
    promotion,
    currentUser,
    customerOwnerType,
  }),
  canSellLot: isAllowedToSellPromotionLotToCustomer({
    promotion,
    currentUser,
    customerOwnerType,
  }),
});

export default withProps(({ promotionLotId, loanId, promotion, currentUser, customerOwnerType }) => ({
  ...makePermissions({ currentUser, promotion, customerOwnerType }),
  bookPromotionLot: () => bookPromotionLot.run({ promotionLotId, loanId }),
  cancelPromotionLotBooking: () =>
    cancelPromotionLotBooking.run({ promotionLotId }),
  sellPromotionLot: () => sellPromotionLot.run({ promotionLotId }),
}));
