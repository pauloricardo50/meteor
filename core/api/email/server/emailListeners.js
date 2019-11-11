import UserService from '../../users/server/UserService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import { promotionShouldAnonymize } from '../../promotions/server/promotionServerHelpers';
import ServerEventService from '../../events/server/ServerEventService';
import {
  requestLoanVerification,
  submitContactForm,
  bookPromotionLot,
  cancelPromotionLotBooking,
  sellPromotionLot,
} from '../../methods';
import { Loans } from '../..';
import { EMAIL_IDS, INTERNAL_EMAIL, FROM_EMAIL } from '../emailConstants';
import { sendEmail, sendEmailToAddress } from '../methodDefinitions';

ServerEventService.addAfterMethodListener(
  requestLoanVerification,
  ({ context, params }) => {
    context.unblock();
    const { loanId } = params;
    const { userId } = Loans.findOne(loanId);

    return sendEmail.run({
      emailId: EMAIL_IDS.VERIFICATION_REQUESTED,
      userId,
      params,
    });
  },
);

ServerEventService.addAfterMethodListener(
  submitContactForm,
  ({ context, params }) => {
    context.unblock();
    return sendEmailToAddress.run({
      emailId: EMAIL_IDS.CONTACT_US,
      address: params.email,
      params,
    });
  },
);

ServerEventService.addAfterMethodListener(
  submitContactForm,
  ({ context, params }) => {
    context.unblock();
    return sendEmailToAddress.run({
      emailId: EMAIL_IDS.CONTACT_US_ADMIN,
      address: INTERNAL_EMAIL,
      params,
    });
  },
);

ServerEventService.addAfterMethodListener(
  sendEmail,
  ({ context, params: { emailId, params, userId } }) => {
    context.unblock();
    const emailsToWatch = [
      EMAIL_IDS.INVITE_USER_TO_PROMOTION,
      EMAIL_IDS.INVITE_USER_TO_PROPERTY,
      EMAIL_IDS.REFER_USER,
    ];

    if (!emailsToWatch.includes(emailId)) {
      return;
    }

    if (!params.proUserId) {
      return;
    }

    const { name, email } = UserService.fetchOne({
      $filters: { _id: userId },
      name: 1,
      email: 1,
    });

    return sendEmail.run({
      emailId: EMAIL_IDS.CONFIRM_USER_INVITATION,
      userId: params.proUserId,
      params: { name, email },
    });
  },
);

const makePromotionLotNotification = (emailId) => ({ context, params }) => {
  context.unblock();
  const { userId } = context;
  const { promotionLotId } = params;
  const {
    name: promotionLotName,
    promotion: {
      userLinks = [],
      _id: promotionId,
      name: promotionName,
      assignedEmployee,
    },
    attributedTo: { _id: loanId, user } = {},
  } = PromotionLotService.fetchOne({
    $filters: { _id: promotionLotId },
    name: 1,
    promotion: { userLinks: 1, name: 1, assignedEmployee: { email: 1 } },
    attributedTo: { borrowers: { name: 1 }, user: { name: 1 } },
  });
  const { name: userName } = UserService.fetchOne({
    $filters: { _id: userId },
    name: 1,
  });

  return Promise.all(userLinks
    .filter(({ enableNotifications }) => enableNotifications)
    .map(({ _id }) => {
      const anonymize = promotionShouldAnonymize({
        customerId: user && user._id,
        userId: _id,
        promotionId,
        promotionLotId,
        loanId,
      });
      return sendEmail.run({
        emailId,
        userId: _id,
        params: {
          promotionId,
          promotionName,
          promotionLotName,
          userName,
          customerName: anonymize
            ? 'une personne anonymisée'
            : user
              ? user.name
              : 'un acquéreur sans nom',
          fromEmail: assignedEmployee && assignedEmployee.email,
        },
      });
    }));
};

ServerEventService.addAfterMethodListener(
  bookPromotionLot,
  makePromotionLotNotification(EMAIL_IDS.BOOK_PROMOTION_LOT),
);

ServerEventService.addAfterMethodListener(
  cancelPromotionLotBooking,
  makePromotionLotNotification(EMAIL_IDS.CANCEL_PROMOTION_LOT_BOOKING),
);

ServerEventService.addAfterMethodListener(
  sellPromotionLot,
  makePromotionLotNotification(EMAIL_IDS.SELL_PROMOTION_LOT),
);
