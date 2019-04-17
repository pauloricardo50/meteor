import ServerEventService from '../../events/server/ServerEventService';
import {
  bookPromotionLot,
  sellPromotionLot,
  proInviteUser,
} from '../../methods';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import UserService from '../../users/server/UserService';
import LoanService from '../../loans/server/LoanService';
import {
  promotionLotBooked,
  promotionLotSold,
  referralOnlyNotification,
} from './slackNotifications';
import {
  sendPropertyInvitations,
  sendPromotionInvitations,
} from './slackNotificationHelpers';

ServerEventService.addMethodListener(
  bookPromotionLot,
  ({ userId }, { promotionLotId, loanId }) => {
    const currentUser = UserService.get(userId);
    const promotionLot = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      name: 1,
      promotion: { name: 1, assignedEmployee: { email: 1 } },
    });
    const { user } = LoanService.fetchOne({
      $filters: { _id: loanId },
      user: { name: 1 },
    });

    promotionLotBooked({ currentUser, promotionLot, user });
  },
);

ServerEventService.addMethodListener(
  sellPromotionLot,
  ({ userId }, { promotionLotId }) => {
    const currentUser = UserService.get(userId);
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

    promotionLotSold({ currentUser, promotionLot, user });
  },
);

ServerEventService.addMethodListener(
  proInviteUser,
  ({ userId }, { propertyIds = [], promotionIds = [], user }) => {
    const currentUser = UserService.get(userId);
    const invitedUser = UserService.getByEmail(user.email);

    sendPropertyInvitations(propertyIds, currentUser, {
      ...invitedUser,
      email: user.email,
    });

    sendPromotionInvitations(promotionIds, currentUser, {
      ...invitedUser,
      email: user.email,
    });

    if (propertyIds.length === 0 && promotionIds.length === 0) {
      referralOnlyNotification({
        currentUser,
        user: { ...invitedUser, email: user.email },
      });
    }
  },
);
