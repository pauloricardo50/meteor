import intl from '../../../utils/intl';
import ServerEventService from '../../events/server/ServerEventService';
import { handleSuccessfulUpload } from '../../files/methodDefinitions';
import { userLoanInsert } from '../../loans/methodDefinitions';
import LoanService from '../../loans/server/LoanService';
import OrganisationService from '../../organisations/server/OrganisationService';
import {
  reservePromotionLot,
  sellPromotionLot,
} from '../../promotionLots/methodDefinitions';
import {
  promotionOptionActivateReservation,
  promotionOptionUploadAgreement,
} from '../../promotionOptions/methodDefinitions';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import PromotionService from '../../promotions/server/PromotionService';
import { PROPERTY_CATEGORY } from '../../properties/propertyConstants';
import {
  anonymousCreateUser,
  proInviteUser,
} from '../../users/methodDefinitions';
import UserService from '../../users/server/UserService';
import { sendPropertyInvitations } from './slackNotificationHelpers';
import {
  newLoan,
  newPromotionReservation,
  newUser,
  promotionAgreementUploaded,
  promotionInviteNotification,
  promotionLotReserved,
  promotionLotSold,
  referralOnlyNotification,
} from './slackNotifications';
import SlackService from './SlackService';

export const slackCurrentUserFragment = {
  name: 1,
  roles: 1,
  assignedEmployee: { name: 1, email: 1 },
};

ServerEventService.addAfterMethodListener(
  reservePromotionLot,
  ({ context, params: { promotionOptionId } }) => {
    context.unblock();
    const { userId } = context;

    const currentUser = UserService.get(userId, slackCurrentUserFragment);
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

    promotionLotReserved({ currentUser, promotionLot, user, loanId });
  },
);

ServerEventService.addAfterMethodListener(
  sellPromotionLot,
  ({ context, params: { promotionOptionId } }) => {
    context.unblock();
    const { userId } = context;
    const currentUser = UserService.get(userId, slackCurrentUserFragment);

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

    promotionLotSold({ currentUser, promotionLot, user, loanId });
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
    const currentUser = UserService.get(userId, slackCurrentUserFragment);
    const invitedUser = UserService.getByEmail(user.email, {
      firstName: 1,
      lastName: 1,
    });

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
    const currentUser = UserService.get(userId, slackCurrentUserFragment);
    const { name: loanName } = LoanService.get(loanId, { name: 1 });

    newLoan({ loanId, loanName, currentUser });
  },
);

ServerEventService.addAfterMethodListener(
  anonymousCreateUser,
  ({ context, result: userId }) => {
    context.unblock();
    const currentUser = UserService.get(userId, slackCurrentUserFragment);
    const {
      loans = [],
      name,
      referredByUserLink,
      referredByOrganisationLink,
    } = currentUser;
    const referredBy = UserService.get(referredByUserLink, { name: 1 });
    const referredByOrg = OrganisationService.get(referredByOrganisationLink, {
      name: 1,
    });

    const suffix = [
      referredBy?.name,
      referredByOrg?.name,
      loans?.[0]?.properties?.[0]?.category === PROPERTY_CATEGORY.PRO &&
        (loans?.[0]?.properties?.[0]?.address1 ||
          loans?.[0]?.properties?.[0]?.name),
      loans[0]?.promotions?.[0]?.name,
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
      loan: { _id: loanId, user: { _id: userId } = {}, promotions = [] },
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

    const currentUser = UserService.get(userId, slackCurrentUserFragment);

    newPromotionReservation({
      currentUser,
      promotionLotName,
      promotionName,
      proName,
      promotionId,
      assignedEmployee,
      loanId,
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

      const currentUser = UserService.get(userId, slackCurrentUserFragment);

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

    const currentUser = UserService.get(proId, slackCurrentUserFragment);

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

ServerEventService.addAfterMethodListener(
  handleSuccessfulUpload,
  ({
    context,
    params: {
      fileName,
      loanId,
      fileMeta: { id, label },
    },
  }) => {
    context.unblock();
    const user = UserService.get(context.userId, slackCurrentUserFragment);
    SlackService.notifyOfUpload({
      currentUser: user,
      fileName,
      loanId,
      docLabel: label || intl.formatMessage({ id: `files.${id}` }),
    });
  },
);
