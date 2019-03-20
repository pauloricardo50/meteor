import { PropertyService } from 'core/api/properties/server/PropertyService';
import ServerEventService from '../../events/server/ServerEventService';
import {
  inviteUserToPromotion,
  bookPromotionLot,
  sellPromotionLot,
  inviteUserToProperty,
} from '../../methods';
import PromotionService from '../../promotions/server/PromotionService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import UserService from '../../users/server/UserService';
import LoanService from '../../loans/server/LoanService';
import { simpleUser } from '../../fragments';
import {
  promotionInviteNotification,
  propertyInviteNotification,
  promotionLotBooked,
  promotionLotSold,
} from './slackNotifications';

ServerEventService.addMethodListener(
  inviteUserToPromotion,
  (context, { promotionId, user }) => {
    const promotion = PromotionService.fetchOne({
      $filters: { _id: promotionId },
      name: 1,
      assignedEmployee: 1,
    });

    promotionInviteNotification({ promotion, user });
  },
);

ServerEventService.addMethodListener(
  bookPromotionLot,
  (context, { promotionLotId, loanId }) => {
    const promotionLot = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      name: 1,
      promotion: { name: 1, assignedEmployee: simpleUser() },
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
      promotion: { name: 1, assignedEmployee: simpleUser() },
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
  inviteUserToProperty,
  ({ userId }, { user, propertyIds }) => {
    const currentUser = UserService.get(userId);
    const invitedUser = UserService.getByEmail(user.email);

    propertyIds.map((id) => {
      const property = PropertyService.get(id);
      propertyInviteNotification({ currentUser, user: invitedUser, property });
    });
  },
);
