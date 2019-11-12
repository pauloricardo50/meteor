import { Meteor } from 'meteor/meteor';

import { proInviteUser } from '../../users/index';
import FileService from '../../files/server/FileService';
import { getUserNameAndOrganisation } from '../../helpers/index';
import PropertyService from '../../properties/server/PropertyService';
import PromotionService from '../../promotions/server/PromotionService';
import { expirePromotionLotReservation } from '../../promotionLots/server/serverMethods';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import UserService from '../../users/server/UserService';
import ServerEventService from '../../events/server/ServerEventService';
import {
  submitContactForm,
  reservePromotionLot,
  cancelPromotionLotReservation,
  sellPromotionLot,
} from '../../methods';
import { EMAIL_IDS, INTERNAL_EMAIL } from '../emailConstants';
import { PROMOTION_EMAIL_RECIPIENTS } from '../../promotions/promotionConstants';
import { sendEmail, sendEmailToAddress } from '../methodDefinitions';

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

ServerEventService.addAfterMethodListener(
  proInviteUser,
  async ({ context, params, result }) => {
    context.unblock();

    if (result && typeof result.then === 'function') {
      result = await result;
    }
    const { userId, isNewUser, pro, admin } = result;
    const { promotionIds = [], propertyIds = [] } = params;

    if (promotionIds.length > 0) {
      promotionIds.forEach(async promotionId => {
        const {
          promotionImage,
          logos,
        } = await FileService.listFilesForDocByCategory(promotionId);
        const coverImageUrl =
          promotionImage && promotionImage.length > 0 && promotionImage[0].url;
        const logoUrls = logos && logos.map(({ url }) => url);

        let ctaUrl = Meteor.settings.public.subdomains.app;
        const promotion = PromotionService.fetchOne({
          $filters: { _id: promotionId },
          name: 1,
          contacts: 1,
          assignedEmployee: { firstName: 1, name: 1, phoneNumbers: 1 },
        });
        const user = UserService.fetchOne({
          $filters: { _id: userId },
          firstName: 1,
        });

        if (isNewUser) {
          // Envoyer invitation avec enrollment link
          ctaUrl = UserService.getEnrollmentUrl({ userId });
        }

        let invitedBy;

        if (pro && pro._id) {
          invitedBy = getUserNameAndOrganisation({
            user: UserService.fetchOne({
              $filters: { _id: pro._id },
              name: 1,
              organisations: { name: 1 },
            }),
          });
        }

        return sendEmail.run({
          emailId: EMAIL_IDS.INVITE_USER_TO_PROMOTION,
          userId,
          params: {
            proUserId: pro && pro._id,
            promotion,
            coverImageUrl,
            logoUrls,
            ctaUrl,
            name: user.firstName,
            invitedBy,
          },
        });
      });
    }

    if (propertyIds.length > 0) {
      let ctaUrl = Meteor.settings.public.subdomains.app;
      const properties = PropertyService.fetch({
        $filters: { _id: { $in: propertyIds } },
        address1: 1,
      });
      const addresses = properties.map(({ address1 }) => `"${address1}"`);

      const formattedAddresses = [
        addresses.slice(0, -1).join(', '),
        addresses.slice(-1)[0],
      ].join(addresses.length < 2 ? '' : ' et ');

      if (isNewUser) {
        // Envoyer invitation avec enrollment link
        ctaUrl = UserService.getEnrollmentUrl({ userId });
      }

      return sendEmail.run({
        emailId: EMAIL_IDS.INVITE_USER_TO_PROPERTY,
        userId,
        params: {
          proUserId: pro && pro._id,
          proName: pro ? getUserNameAndOrganisation({ user: pro }) : admin.name,
          address: formattedAddresses,
          ctaUrl,
          multiple: addresses.length > 1,
        },
      });
    }

    if (propertyIds.length === 0 && promotionIds.length === 0) {
      sendEmail.run({
        emailId: EMAIL_IDS.REFER_USER,
        userId,
        params: {
          proUserId: pro && pro._id,
          proName: getUserNameAndOrganisation({ user: pro }),
          ctaUrl: UserService.getEnrollmentUrl({ userId }),
        },
      });
    }
  },
);

const getPromotionOptionMailParams = async (
  { context, params, result },
  recipient,
) => {
  context.unblock();
  if (result && typeof result.then === 'function') {
    result = await result;
  }
  const { anonymize } = recipient;
  const { userId } = context;
  const { promotionOptionId } = params;
  const { promotionLots = [] } = PromotionOptionService.fetchOne({
    $filters: { _id: promotionOptionId },
    promotionLots: {
      name: 1,
      promotion: {
        userLinks: 1,
        name: 1,
        assignedEmployee: { email: 1 },
      },
      attributedTo: { borrowers: { name: 1 }, user: { name: 1 } },
    },
  });
  const [
    {
      name: promotionLotName,
      promotion: { _id: promotionId, name: promotionName, assignedEmployee },
      attributedTo: { user } = {},
    },
  ] = promotionLots;

  let userName = 'e-Potek';

  if (userId) {
    const { name } = UserService.fetchOne({
      $filters: { _id: userId },
      name: 1,
    });
    userName = name;
  }

  return {
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
  };
};

const PROMOTION_EMAILS = [
  {
    method: reservePromotionLot,
    emailId: EMAIL_IDS.RESERVE_PROMOTION_LOT,
    recipients: [
      // {
      //   type: PROMOTION_EMAIL_RECIPIENTS.USER,
      //   emailId: 'EMAIL_IDS.USER_RESERVE_PROMOTION_LOT',
      //   getEmailParams: () => ({}),
      // },
      // {
      //   type: PROMOTION_EMAIL_RECIPIENTS.BROKER,
      //   emailId: 'EMAIL_IDS.BROKER_RESERVE_PROMOTION_LOT',
      //   getEmailParams: () => ({}),
      // },
      { type: PROMOTION_EMAIL_RECIPIENTS.BROKER },
      { type: PROMOTION_EMAIL_RECIPIENTS.BROKERS },
      { type: PROMOTION_EMAIL_RECIPIENTS.PROMOTER },
    ],
    getEmailParams: getPromotionOptionMailParams,
  },
  {
    method: sellPromotionLot,
    emailId: EMAIL_IDS.SELL_PROMOTION_LOT,
    recipients: [
      // {
      //   type: PROMOTION_EMAIL_RECIPIENTS.USER,
      //   emailId: 'EMAIL_IDS.USER_SELL_PROMOTION_LOT',
      //   getEmailParams: () => ({}),
      // },
      // {
      //   type: PROMOTION_EMAIL_RECIPIENTS.BROKER,
      //   emailId: 'EMAIL_IDS.BROKER_SELL_PROMOTION_LOT',
      //   getEmailParams: () => ({}),
      // },
      { type: PROMOTION_EMAIL_RECIPIENTS.BROKER },
      { type: PROMOTION_EMAIL_RECIPIENTS.BROKERS },
      { type: PROMOTION_EMAIL_RECIPIENTS.PROMOTER },
    ],
    getEmailParams: getPromotionOptionMailParams,
  },
  {
    method: [cancelPromotionLotReservation, expirePromotionLotReservation],
    emailId: EMAIL_IDS.CANCEL_PROMOTION_LOT_RESERVATION,
    recipients: [
      // {
      //   type: PROMOTION_EMAIL_RECIPIENTS.USER,
      //   emailId: 'EMAIL_IDS.USER_CANCEL_PROMOTION_LOT',
      //   getEmailParams: () => ({}),
      // },
      // {
      //   type: PROMOTION_EMAIL_RECIPIENTS.BROKER,
      //   emailId: 'EMAIL_IDS.BROKER_CANCEL_PROMOTION_LOT',
      //   getEmailParams: () => ({}),
      // },
      { type: PROMOTION_EMAIL_RECIPIENTS.BROKER },
      { type: PROMOTION_EMAIL_RECIPIENTS.BROKERS },
      { type: PROMOTION_EMAIL_RECIPIENTS.PROMOTER },
    ],
    getEmailParams: getPromotionOptionMailParams,
  },
];

PROMOTION_EMAILS.forEach(({ method, emailId, recipients, getEmailParams }) => {
  ServerEventService.addAfterMethodListener(method, (...args) => {
    const [
      {
        params: { promotionOptionId },
      },
    ] = args;
    const emailRecipients = PromotionOptionService.getEmailRecipients({
      promotionOptionId,
    });
    recipients.forEach(
      ({
        type,
        emailId: emailIdOverride,
        getEmailParams: getEmailParamsOverride,
      }) => {
        emailRecipients[type].forEach(async recipient => {
          const { userId } = recipient;
          const emailParams = getEmailParamsOverride
            ? await getEmailParamsOverride(...args, recipient)
            : await getEmailParams(...args, recipient);
          sendEmail.run({
            emailId: emailIdOverride || emailId,
            userId,
            params: emailParams,
          });
        });
      },
    );
  });
});
