import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import ServerEventService from '../../events/server/ServerEventService';
import {
  bookPromotionLot,
  sellPromotionLot,
  proInviteUser,
  userLoanInsert,
  anonymousCreateUser,
} from '../../methods';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import UserService from '../../users/server/UserService';
import LoanService from '../../loans/server/LoanService';
import OrganisationService from '../../organisations/server/OrganisationService';
import {
  promotionLotBooked,
  promotionLotSold,
  referralOnlyNotification,
  newLoan,
  newUser,
} from './slackNotifications';
import {
  sendPropertyInvitations,
  sendPromotionInvitations,
} from './slackNotificationHelpers';

ServerEventService.addAfterMethodListener(
  bookPromotionLot,
  ({ context, params: { promotionLotId, loanId } }) => {
    context.unblock();
    const { userId } = context;
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
  ({ context, params: { promotionLotId } }) => {
    context.unblock();
    const { userId } = context;
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
    context,
    params: { propertyIds = [], properties = [], promotionIds = [], user },
  }) => {
    context.unblock();
    const { userId } = context;
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
  userLoanInsert,
  ({ context, result: loanId }) => {
    context.unblock();
    const { userId } = context;
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
  ({ context, result: userId }) => {
    context.unblock();
    const currentUser = UserService.get(userId);
    const {
      loans = [],
      name,
      referredByUserLink,
      referredByOrganisationLink,
    } = currentUser;
    const referredBy = UserService.get(referredByUserLink);
    const referredByOrg = OrganisationService.get(referredByOrganisationLink);

    const suffix = [
      referredBy && referredBy.name,
      referredByOrg && referredByOrg.name,
      loans[0] &&
        loans[0].properties &&
        loans[0].properties[0] &&
        loans[0].properties[0].category === PROPERTY_CATEGORY.PRO &&
        (loans[0].properties[0].address1 || loans[0].properties[0].name),
      loans[0] &&
        loans[0].promotions &&
        loans[0].promotions[0] &&
        loans[0].promotions[0].name,
    ]
      .filter(x => x)
      .map(x => `(${x})`)
      .join(' ');

    newUser({ loans, name, currentUser, suffix });
  },
);
