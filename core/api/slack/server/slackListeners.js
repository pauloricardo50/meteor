import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import PromotionOptionService from 'core/api/promotionOptions/server/PromotionOptionService';
import { promotionOptionUploadAgreement } from 'core/api/methods/index';
import { fullUser } from 'core/api/fragments';
import ServerEventService from '../../events/server/ServerEventService';
import {
  reservePromotionLot,
  sellPromotionLot,
  proInviteUser,
  userLoanInsert,
  anonymousCreateUser,
  promotionOptionActivateReservation,
} from '../../methods';
import UserService from '../../users/server/UserService';
import LoanService from '../../loans/server/LoanService';
import OrganisationService from '../../organisations/server/OrganisationService';
import {
  promotionLotReserved,
  promotionLotSold,
  referralOnlyNotification,
  newLoan,
  newUser,
  newPromotionReservation,
  promotionInviteNotification,
  promotionAgreementUploaded,
} from './slackNotifications';
import { sendPropertyInvitations } from './slackNotificationHelpers';
import PromotionService from '../../promotions/server/PromotionService';

ServerEventService.addAfterMethodListener(
  reservePromotionLot,
  ({ context, params: { promotionOptionId } }) => {
    context.unblock();
    const { userId } = context;

    const currentUser = UserService.get(userId, fullUser());
    const {
      promotionLots = [],
      loan: { _id: loanId },
    } = PromotionOptionService.get(promotionOptionId, {
      loan: { _id: 1 },
      promotionLots: {
        name: 1,
        promotion: { name: 1, assignedEmployee: { email: 1 } },
      },
    });
    const [promotionLot] = promotionLots;

    const { user } = LoanService.get(loanId, { user: { name: 1 } });

    promotionLotReserved({ currentUser, promotionLot, user });
  },
);

ServerEventService.addAfterMethodListener(
  sellPromotionLot,
  ({ context, params: { promotionOptionId } }) => {
    context.unblock();
    const { userId } = context;
    const currentUser = UserService.get(userId, fullUser());

    const {
      promotionLots = [],
      loan: { _id: loanId },
    } = PromotionOptionService.get(promotionOptionId, {
      loan: { _id: 1 },
      promotionLots: {
        name: 1,
        promotion: { name: 1, assignedEmployee: { email: 1 } },
        attributedTo: { _id: 1 },
      },
    });

    const [{ attributedTo, ...promotionLot }] = promotionLots;

    const { user } = LoanService.get(attributedTo._id, { user: { name: 1 } });

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
    const currentUser = UserService.get(userId, fullUser());
    const invitedUser = UserService.getByEmail(user.email);

    sendPropertyInvitations(notificationPropertyIds, currentUser, {
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
    const currentUser = UserService.get(userId, fullUser());
    const { name: loanName } = LoanService.get(loanId, { name: 1 });

    newLoan({ loanId, loanName, currentUser });
  },
);

ServerEventService.addAfterMethodListener(
  anonymousCreateUser,
  ({ context, result: userId }) => {
    context.unblock();
    const currentUser = UserService.get(userId, fullUser());
    const {
      loans = [],
      name,
      referredByUserLink,
      referredByOrganisationLink,
    } = currentUser;
    const referredBy = UserService.get(referredByUserLink, fullUser());
    const referredByOrg = OrganisationService.get(
      referredByOrganisationLink,
      { name: 1 }
    );

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

ServerEventService.addAfterMethodListener(
  promotionOptionActivateReservation,
  ({ context, params: { promotionOptionId } }) => {
    const {
      loan: { user: { _id: userId } = {}, promotions = [] },
      promotionLots = [],
      promotion: {
        name: promotionName,
        _id: promotionId,
        assignedEmployee,
      } = {},
    } = PromotionOptionService.get(promotionOptionId, {
      loan: { user: { _id: 1 }, promotions: { _id: 1 } },
      promotionLots: { name: 1 },
      promotion: { name: 1, assignedEmployee: { email: 1 } },
    });
    const [
      {
        $metadata: { invitedBy },
      },
    ] = promotions;
    const { name: proName } = UserService.get(invitedBy, { name: 1 });
    const [{ name: promotionLotName }] = promotionLots;

    const currentUser = UserService.get(userId, fullUser());

    newPromotionReservation({
      currentUser,
      promotionLotName,
      promotionName,
      proName,
      promotionId,
      assignedEmployee,
    });
  },
);

ServerEventService.addAfterMethodListener(
  proInviteUser,
  ({
    context: { userId: proId },
    params: { promotionIds = [] },
    result: { userId },
  }) => {
    if (promotionIds.length) {
      const [promotionId] = promotionIds;
      const { name: promotionName, assignedEmployee } = PromotionService.get(
        promotionId,
        {
          name: 1,
          assignedEmployee: { email: 1 },
        },
      );

      const currentUser = UserService.get(userId, fullUser());

      const { name: proName } = UserService.get(proId, { name: 1 });

      promotionInviteNotification({
        currentUser,
        promotionName,
        assignedEmployee,
        proName,
        promotionId,
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  promotionOptionUploadAgreement,
  ({ context: { userId: proId }, params: { promotionOptionId } }) => {
    const {
      promotion: { _id: promotionId, name: promotionName, assignedEmployee },
      promotionLots = [],
      loan: {
        user: { name: userName },
      },
      reservationAgreement: { startDate, expirationDate },
    } = PromotionOptionService.get(promotionOptionId, {
      promotion: {
        name: 1,
        assignedEmployee: { email: 1 },
      },
      promotionLots: { name: 1 },
      loan: { user: { name: 1 } },
      reservationAgreement: { startDate: 1, expirationDate: 1 },
    });

    const [{ name: promotionLotName }] = promotionLots;

    const currentUser = UserService.get(proId, fullUser());

    promotionAgreementUploaded({
      currentUser,
      promotionLotName,
      promotionName,
      promotionId,
      userName,
      assignedEmployee,
      startDate,
      expirationDate,
    });
  },
);
