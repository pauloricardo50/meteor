import PropertyService from 'core/api/properties/server/PropertyService';
import ServerEventService from '../../events/server/ServerEventService';
import {
  bookPromotionLot,
  sellPromotionLot,
  proInviteUser,
  anonymousLoanInsert,
  userLoanInsert,
  anonymousCreateUser,
} from '../../methods';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import UserService from '../../users/server/UserService';
import LoanService from '../../loans/server/LoanService';
import {
  promotionLotBooked,
  promotionLotSold,
  referralOnlyNotification,
  newAnonymousLoan,
  newLoan,
  newUser,
} from './slackNotifications';
import {
  sendPropertyInvitations,
  sendPromotionInvitations,
} from './slackNotificationHelpers';

ServerEventService.addAfterMethodListener(
  bookPromotionLot,
  ({ context: { userId }, params: { promotionLotId, loanId } }) => {
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

ServerEventService.addAfterMethodListener(
  sellPromotionLot,
  ({ context: { userId }, params: { promotionLotId } }) => {
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

ServerEventService.addAfterMethodListener(
  proInviteUser,
  ({
    context: { userId },
    params: { propertyIds = [], properties = [], promotionIds = [], user },
  }) => {
    const notificationPropertyIds = [
      ...propertyIds,
      ...properties.map(({ _id, externalId }) => _id || externalId),
    ];
    const currentUser = UserService.get(userId);
    const invitedUser = UserService.getByEmail(user.email);

    sendPropertyInvitations(notificationPropertyIds, currentUser, {
      ...invitedUser,
      email: user.email,
    });

    sendPromotionInvitations(promotionIds, currentUser, {
      ...invitedUser,
      email: user.email,
    });

    if (notificationPropertyIds.length === 0 && promotionIds.length === 0) {
      referralOnlyNotification({
        currentUser,
        user: { ...invitedUser, email: user.email },
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  anonymousLoanInsert,
  ({ params: { proPropertyId, referralId }, result: loanId }) => {
    const property = proPropertyId
      && PropertyService.fetchOne({
        $filters: { _id: proPropertyId },
        address1: 1,
      });
    const { name: loanName } = LoanService.fetchOne({
      $filters: { _id: loanId },
      name: 1,
    });
    const referral = referralId
      && UserService.fetchOne({
        $filters: { _id: referralId },
        name: 1,
        organisations: { name: 1 },
      });

    newAnonymousLoan({ loanName, loanId, property, referral });
  },
);

ServerEventService.addAfterMethodListener(
  userLoanInsert,
  ({ context: { userId }, result: loanId }) => {
    const currentUser = UserService.get(userId);
    const { name: loanName } = LoanService.fetchOne({
      $filters: { _id: loanId },
      name: 1,
    });

    newLoan({ loanId, loanName, currentUser });
  },
);

ServerEventService.addAfterMethodListener(
  anonymousCreateUser,
  ({ result: userId }) => {
    const currentUser = UserService.get(userId);
    const { loans, name } = UserService.get(userId);

    newUser({ loans, name, currentUser });
  },
);
