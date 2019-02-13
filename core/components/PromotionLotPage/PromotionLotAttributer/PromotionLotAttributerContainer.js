import { compose, withProps, withState } from 'recompose';

import {
  bookPromotionLot,
  cancelPromotionLotBooking,
  sellPromotionLot,
} from 'core/api';
import {
  isAllowedToBookPromotionLotToCustomer,
  isAllowedToSellPromotionLotToCustomer,
} from '../../../api/security/clientSecurityHelpers';

const makePermissions = ({ currentUser, promotion, customerOwningGroup }) => ({
  canBookLot: isAllowedToBookPromotionLotToCustomer({
    promotion,
    currentUser,
    customerOwningGroup,
  }),
  canSellLot: isAllowedToSellPromotionLotToCustomer({
    promotion,
    currentUser,
    customerOwningGroup,
  }),
});

export default compose(withProps(({
  promotionLotId,
  loanId,
  promotion,
  currentUser,
  customerOwningGroup,
}) => ({
  ...makePermissions({ currentUser, promotion, customerOwningGroup }),
  bookPromotionLot: () => bookPromotionLot.run({ promotionLotId, loanId }),
  cancelPromotionLotBooking: () =>
    cancelPromotionLotBooking.run({ promotionLotId }),
  sellPromotionLot: () => sellPromotionLot.run({ promotionLotId }),
})));
