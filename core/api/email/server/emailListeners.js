import { Meteor } from 'meteor/meteor';

import moment from 'moment';

import { internalMethod } from 'core/api/methods/server/methodHelpers';
import { shouldSendStepNotification } from '../../../utils/loanFunctions';
import {
  submitContactForm,
  setLoanStep,
  sendNegativeFeedbackToAllLenders,
  proInviteUser,
  offerSendFeedback,
} from '../../methods/index';
import OfferService from '../../offers/server/OfferService';
import FileService from '../../files/server/FileService';
import PropertyService from '../../properties/server/PropertyService';
import PromotionService from '../../promotions/server/PromotionService';
import UserService from '../../users/server/UserService';
import { getUserNameAndOrganisation } from '../../helpers/index';
import { EMAIL_IDS, INTERNAL_EMAIL } from '../emailConstants';
import { sendEmail, sendEmailToAddress } from './methods';
import { addEmailListener } from './emailHelpers';
import { PROMOTION_EMAILS, mapConfigToListener } from './promotionEmailHelpers';

addEmailListener({
  description: 'Formulaire de contact -> Client',
  method: submitContactForm,
  func: ({ params }) =>
    internalMethod(() =>
      sendEmailToAddress.run({
        emailId: EMAIL_IDS.CONTACT_US,
        address: params.email,
        params,
      }),
    ),
});

addEmailListener({
  description: 'Formulaire de contact -> info@e-potek.ch',
  method: submitContactForm,
  func: ({ params }) =>
    internalMethod(() =>
      sendEmailToAddress.run({
        emailId: EMAIL_IDS.CONTACT_US_ADMIN,
        address: INTERNAL_EMAIL,
        params,
      }),
    ),
});

addEmailListener({
  description: "Confirmation d'invitation d'un client par un Pro -> Pro",
  method: sendEmail,
  func: ({ params: { emailId, params, userId } }) => {
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

    const { name: customerName, email } = UserService.fetchOne({
      $filters: { _id: userId },
      name: 1,
      email: 1,
    });

    const { promotion, proUserId } = params;

    if (emailId === EMAIL_IDS.INVITE_USER_TO_PROMOTION) {
      return internalMethod(() =>
        sendEmail.run({
          emailId: EMAIL_IDS.CONFIRM_PROMOTION_USER_INVITATION,
          userId: proUserId,
          params: { customerName, email, promotionName: promotion.name },
        }),
      );
    }

    return internalMethod(() =>
      sendEmail.run({
        emailId: EMAIL_IDS.CONFIRM_USER_INVITATION,
        userId: proUserId,
        params: { customerName, email },
      }),
    );
  },
});

addEmailListener({
  description: 'Étape du dossier à "Identification du prêteur" -> Client',
  method: setLoanStep,
  func: ({ params: { loanId }, result: { step, nextStep, user } }) => {
    if (shouldSendStepNotification(step, nextStep)) {
      if (!user || !user.assignedEmployee) {
        throw new Meteor.Error(
          'Il faut un client et un conseiller sur ce dossier pour envoyer un email',
        );
      }

      internalMethod(() =>
        sendEmail.run({
          emailId: EMAIL_IDS.FIND_LENDER_NOTIFICATION,
          userId: user._id,
          params: { loanId, assigneeName: user.assignedEmployee.name },
        }),
      );
    }
  },
});

const sendOfferFeedbackEmail = ({ offerId, feedback }) => {
  const {
    createdAt,
    lender: {
      organisation: { name: organisationName },
      contact: { email: address, name },
      loan: {
        name: loanName,
        user: { assignedEmployee },
      },
    },
  } = OfferService.fetchOne({
    $filters: { _id: offerId },
    createdAt: 1,
    lender: {
      organisation: { name: 1 },
      contact: { email: 1, name: 1 },
      loan: { name: 1, user: { assignedEmployee: { name: 1, email: 1 } } },
    },
  });

  const { email: assigneeAddress, name: assigneeName } = assignedEmployee || {};

  return internalMethod(() =>
    sendEmailToAddress.run({
      emailId: EMAIL_IDS.SEND_FEEDBACK_TO_LENDER,
      address,
      name,
      params: {
        assigneeAddress,
        assigneeName,
        loanName,
        organisationName,
        date: moment(createdAt).format('DD.MM.YYYY'),
        feedback,
      },
    }),
  );
};

addEmailListener({
  description: "Envoyer feedback d'une offre à un prêteur -> Prêteur",
  method: offerSendFeedback,
  func: ({ params }) => sendOfferFeedbackEmail(params),
});

addEmailListener({
  description: "Feedback négatif à tous les prêteurs d'un dossier -> Prêteurs",
  method: sendNegativeFeedbackToAllLenders,
  func: ({ result }) => {
    result.map(sendOfferFeedbackEmail);
  },
});

addEmailListener({
  description: "Invitation d'un client par un Pro sur une promotion -> Client",
  method: proInviteUser,
  func: ({
    params: { promotionIds = [] },
    result: { userId, isNewUser, pro },
  }) => {
    if (!promotionIds.length) {
      return;
    }

    promotionIds.forEach(async promotionId => {
      const {
        promotionImage,
        logos,
        promotionGuide,
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

      let attachments = [];

      if (promotionGuide) {
        attachments = [promotionGuide[0].Key];
      }

      return internalMethod(() =>
        sendEmail.run({
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
            attachments,
          },
        }),
      );
    });
  },
});

addEmailListener({
  description:
    "Invitation d'un client par un Pro sur un ou plusieurs bien immo -> Client",
  method: proInviteUser,
  func: ({
    params: { propertyIds = [] },
    result: { userId, isNewUser, pro, admin },
  }) => {
    if (!propertyIds.length) {
      return;
    }

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

    return internalMethod(() =>
      sendEmail.run({
        emailId: EMAIL_IDS.INVITE_USER_TO_PROPERTY,
        userId,
        params: {
          proUserId: pro && pro._id,
          proName: pro ? getUserNameAndOrganisation({ user: pro }) : admin.name,
          address: formattedAddresses,
          ctaUrl,
          multiple: addresses.length > 1,
        },
      }),
    );
  },
});

addEmailListener({
  description:
    "Invitation d'un client par un Pro en referral uniquement -> Client",
  method: proInviteUser,
  func: ({
    params: { promotionIds = [], propertyIds = [] },
    result: { userId, pro },
  }) => {
    if (propertyIds.length || promotionIds.length) {
      return;
    }

    sendEmail.run({
      emailId: EMAIL_IDS.REFER_USER,
      userId,
      params: {
        proUserId: pro && pro._id,
        proName: getUserNameAndOrganisation({ user: pro }),
        ctaUrl: UserService.getEnrollmentUrl({ userId }),
      },
    });
  },
});

//
// PROMOTION EMAILS
//
// PROMOTION_EMAILS.forEach(({ description, method, ...config }) => {
//   addEmailListener({
//     description,
//     method,
//     func: mapConfigToListener(config),
//   });
// });
