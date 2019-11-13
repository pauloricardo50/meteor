import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import PromotionOptionService from 'core/api/promotionOptions/server/PromotionOptionService';
import { promotionOptionUploadAgreement } from 'core/api/methods/index';
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
  async ({ context, params: { promotionOptionId }, result }) => {
    context.unblock();
    const { userId } = context;
    if (typeof result.then === 'function') {
      await result;
    }

    const currentUser = UserService.get(userId);
    const {
      promotionLots = [],
      loan: { _id: loanId },
    } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1 },
      promotionLots: {
        name: 1,
        promotion: { name: 1, assignedEmployee: { email: 1 } },
      },
    });
    const [promotionLot] = promotionLots;

    const { user } = LoanService.fetchOne({
      $filters: { _id: loanId },
      user: { name: 1 },
    });

    promotionLotReserved({ currentUser, promotionLot, user });
  },
);

ServerEventService.addAfterMethodListener(
  sellPromotionLot,
  ({ context, params: { promotionOptionId } }) => {
    context.unblock();
    const { userId } = context;
    const currentUser = UserService.get(userId);

    const {
      promotionLots = [],
      loan: { _id: loanId },
    } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1 },
      promotionLots: {
        name: 1,
        promotion: { name: 1, assignedEmployee: { email: 1 } },
      },
    });

    const [{ attributedTo, ...promotionLot }] = promotionLots;

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
    } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { user: { _id: 1 }, promotions: { _id: 1 } },
      promotionLots: { name: 1 },
      promotion: { name: 1, assignedEmployee: { email: 1 } },
    });
    const [
      {
        $metadata: { invitedBy },
      },
    ] = promotions;
    const { name: proName } = UserService.fetchOne({
      $filters: { _id: invitedBy },
      name: 1,
    });
    const [{ name: promotionLotName }] = promotionLots;

    const currentUser = UserService.get(userId);

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
      const {
        name: promotionName,
        assignedEmployee,
      } = PromotionService.fetchOne({
        $filters: { _id: promotionId },
        name: 1,
        assignedEmployee: { email: 1 },
      });

      const currentUser = UserService.get(userId);

      const { name: proName } = UserService.fetchOne({
        $filters: { _id: proId },
        name: 1,
      });

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
  ({
    context: { userId: proId },
    params: { promotionOptionId, startDate },
  }) => {
    const {
      promotion: {
        _id: promotionId,
        name: promotionName,
        assignedEmployee,
        agreementDuration,
      },
      promotionLots = [],
      loan: {
        user: { name: userName },
      },
    } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      promotion: {
        name: 1,
        assignedEmployee: { email: 1 },
        agreementDuration: 1,
      },
      promotionLots: { name: 1 },
      loan: { user: { name: 1 } },
    });

    const [{ name: promotionLotName }] = promotionLots;

    const currentUser = UserService.get(proId);

    promotionAgreementUploaded({
      currentUser,
      promotionLotName,
      promotionName,
      promotionId,
      userName,
      assignedEmployee,
      startDate,
      expirationDate: PromotionOptionService.getReservationExpirationDate({
        startDate,
        agreementDuration,
      }),
    });
  },
);
