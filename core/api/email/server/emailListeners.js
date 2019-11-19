import { Meteor } from 'meteor/meteor';

import moment from 'moment';

import { shouldSendStepNotification } from '../../../utils/loanFunctions';
import {
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
} from '../../promotionOptions/promotionOptionConstants';
import {
  setPromotionOptionProgress,
  promotionOptionActivateReservation,
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
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import UserService from '../../users/server/UserService';
import { getUserNameAndOrganisation } from '../../helpers/index';
import { EMAIL_IDS, INTERNAL_EMAIL } from '../emailConstants';
import { sendEmail, sendEmailToAddress } from './methods';
import { addEmailListener } from './emailHelpers';
import { PROMOTION_EMAILS, mapConfigToListener } from './promotionEmailHelpers';

addEmailListener({
  description: 'Formulaire de contact -> Client',
  method: submitContactForm,
  func: ({ params }) => {
    return sendEmailToAddress.run({
      emailId: EMAIL_IDS.CONTACT_US,
      address: params.email,
      params,
    });
  },
});

addEmailListener({
  description: 'Formulaire de contact -> info@e-potek.ch',
  method: submitContactForm,
  func: ({ params }) => {
    return sendEmailToAddress.run({
      emailId: EMAIL_IDS.CONTACT_US_ADMIN,
      address: INTERNAL_EMAIL,
      params,
    });
  },
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

    const { name, email } = UserService.fetchOne({
      $filters: { _id: userId },
      name: 1,
      email: 1,
    });

    if (emailId === EMAIL_IDS.INVITE_USER_TO_PROMOTION) {
      const { promotion } = params;
      return sendEmail.run({
        emailId: EMAIL_IDS.CONFIRM_PROMOTION_USER_INVITATION,
        userId: params.proUserId,
        params: { name, email, promotionName: promotion.name },
      });
    }

    return sendEmail.run({
      emailId: EMAIL_IDS.CONFIRM_USER_INVITATION,
      userId: params.proUserId,
      params: { name, email },
    });
  },
});

addEmailListener({
  description: 'Étape du dossier à "Identification du prêteur" -> Client',
  method: setLoanStep,
  func: ({ params: { loanId }, result: { step, nextStep, user } }) => {
    if (shouldSendStepNotification(step, nextStep)) {
      if (!user || !user.assignedEmployee) {
        throw new Meteor.Error(
          'Il faut un conseiller sur ce dossier pour envoyer un email',
        );
      }

      sendEmail.run({
        emailId: EMAIL_IDS.FIND_LENDER_NOTIFICATION,
        userId: user._id,
        params: { loanId, assigneeName: user.assignedEmployee.name },
      });
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

  return sendEmailToAddress.run({
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
  });
};

addEmailListener({
  description: "Envoyer feedback d'une offre à un prêteur -> Prêteur",
  method: offerSendFeedback,
  func: ({ params }) => sendOfferFeedbackEmail(params),
});

addEmailListener({
  description: "Feedback négatif à tous les prêteurs d'un dossier -> Prêteurs",
  method: sendNegativeFeedbackToAllLenders,
  func: async ({ result }) => {
    if (result && typeof result.then === 'function') {
      result = await result;
    }

    result.map(sendOfferFeedbackEmail);
  },
});

addEmailListener({
  description: "Invitation d'un client par un Pro -> Client",
  method: proInviteUser,
  func: async ({ params, result }) => {
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
});

//
// PROMOTION EMAILS
//
PROMOTION_EMAILS.forEach(({ description, method, ...config }) => {
  addEmailListener({
    description,
    method,
    func: mapConfigToListener(config),
  });
});
