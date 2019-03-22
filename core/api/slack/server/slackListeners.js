import { PropertyService } from 'core/api/properties/server/PropertyService';
import ServerEventService from '../../events/server/ServerEventService';
import {
  bookPromotionLot,
  sellPromotionLot,
  proInviteUser,
} from '../../methods';
import PromotionService from '../../promotions/server/PromotionService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import UserService from '../../users/server/UserService';
import LoanService from '../../loans/server/LoanService';
import {
  promotionInviteNotification,
  promotionLotBooked,
  promotionLotSold,
  propertyInviteNotification,
  referralOnlyNotification,
} from './slackNotifications';

ServerEventService.addMethodListener(
  bookPromotionLot,
  (context, { promotionLotId, loanId }) => {
    const promotionLot = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      name: 1,
      promotion: { name: 1, assignedEmployee: { email: 1 } },
    });
    const { user } = LoanService.fetchOne({
      $filters: { _id: loanId },
      user: { name: 1 },
    });

    promotionLotBooked({ promotionLot, user });
  },
);

ServerEventService.addMethodListener(
  sellPromotionLot,
  (context, { promotionLotId }) => {
    const { attributedTo, ...promotionLot } = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      name: 1,
      promotion: { name: 1, assignedEmployee: { email: 1 } },
      attributedTo: { _id: 1 },
    });
    const { user } = LoanService.fetchOne({
      $filters: { _id: attributedTo._id },
      user: { name: 1 },
    });

    promotionLotSold({ promotionLot, user });
  },
);

ServerEventService.addMethodListener(
  proInviteUser,
  ({ userId }, { propertyIds = [], promotionIds = [], user }) => {
    const currentUser = UserService.get(userId);
    const invitedUser = UserService.getByEmail(user.email);

    propertyIds.map((id) => {
      const property = PropertyService.get(id);
      propertyInviteNotification({ currentUser, user: invitedUser, property });
    });

    promotionIds.map((id) => {
      const promotion = PromotionService.fetchOne({
        $filters: { _id: id },
        name: 1,
        assignedEmployee: { email: 1 },
      });
      promotionInviteNotification({ promotion, user: invitedUser });
    });

    if (propertyIds.length === 0 && promotionIds.length === 0) {
      referralOnlyNotification({ currentUser, user: invitedUser });
    }
  },
);
