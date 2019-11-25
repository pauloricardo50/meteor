import { internalMethod } from 'core/api/methods/server/methodHelpers';
import {
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
} from '../../promotionOptions/promotionOptionConstants';
import { PROMOTION_EMAIL_RECIPIENTS } from '../../promotions/promotionConstants';
import {
  reservePromotionLot,
  cancelPromotionLotReservation,
  sellPromotionLot,
  promotionOptionUploadAgreement,
  setPromotionOptionProgress,
  promotionOptionActivateReservation,
} from '../../methods';
import { expirePromotionLotReservation } from '../../promotionLots/server/serverMethods';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import UserService from '../../users/server/UserService';
import { getUserNameAndOrganisation } from '../../helpers/helpers';
import { EMAIL_IDS } from '../emailConstants';
import { sendEmail } from './methods';

const getPromotionOptionMailParams = ({ context, params }, recipient) => {
  const { anonymize } = recipient;
  const { userId } = context;
  const { promotionOptionId } = params;
  const {
    promotionLots = [],
    promotion: { _id: promotionId, name: promotionName, assignedEmployee },
    loan: { promotionLinks },
  } = PromotionOptionService.fetchOne({
    $filters: { _id: promotionOptionId },
    promotionLots: {
      name: 1,
      attributedTo: { borrowers: { name: 1 }, user: { name: 1 } },
    },
    promotion: {
      userLinks: 1,
      name: 1,
      assignedEmployee: { email: 1, name: 1 },
    },
    loan: { promotionLinks: 1 },
  });
  const [
    { name: promotionLotName, attributedTo: { user } = {} },
  ] = promotionLots;
  const [{ invitedBy }] = promotionLinks;

  const invitedByUser = UserService.fetchOne({
    $filters: { _id: invitedBy },
    name: 1,
    organisations: { name: 1 },
  });

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
      ? 'un acquéreur'
      : user
      ? user.name
      : 'un acquéreur',
    fromEmail: assignedEmployee && assignedEmployee.email,
    assignedEmployeeName: assignedEmployee
      ? assignedEmployee.name
      : 'Le conseiller',
    invitedBy: getUserNameAndOrganisation({ user: invitedByUser }),
  };
};

export const PROMOTION_EMAILS = [
  {
    description: 'Nouvelle demande de réservation par un client -> Pro',
    method: promotionOptionActivateReservation,
    recipients: [PROMOTION_EMAIL_RECIPIENTS.BROKER],
    emailId: EMAIL_IDS.PROMOTION_RESERVATION_ACTIVATION,
  },
  {
    description: [
      "Confirmation de réservation d'un lot -> Client",
      "Confirmation de réservation d'un lot -> Pros",
    ],
    method: reservePromotionLot,
    emailId: EMAIL_IDS.RESERVE_PROMOTION_LOT,
    recipients: [
      {
        type: PROMOTION_EMAIL_RECIPIENTS.USER,
        emailId: EMAIL_IDS.RESERVE_PROMOTION_LOT_USER,
      },
      PROMOTION_EMAIL_RECIPIENTS.BROKER,
      PROMOTION_EMAIL_RECIPIENTS.BROKERS,
      PROMOTION_EMAIL_RECIPIENTS.PROMOTER,
    ],
  },
  {
    description: [
      "Confirmation de vente d'un lot -> Client",
      "Confirmation de vente d'un lot -> Pros",
    ],
    method: sellPromotionLot,
    emailId: EMAIL_IDS.SELL_PROMOTION_LOT,
    recipients: [
      {
        type: PROMOTION_EMAIL_RECIPIENTS.USER,
        emailId: EMAIL_IDS.SELL_PROMOTION_LOT_USER,
      },
      PROMOTION_EMAIL_RECIPIENTS.BROKER,
      PROMOTION_EMAIL_RECIPIENTS.BROKERS,
      PROMOTION_EMAIL_RECIPIENTS.PROMOTER,
    ],
  },
  {
    description: "Annulation de la réservation d'un lot -> Pros",
    method: [cancelPromotionLotReservation, expirePromotionLotReservation],
    emailId: EMAIL_IDS.CANCEL_PROMOTION_LOT_RESERVATION,
    recipients: [
      PROMOTION_EMAIL_RECIPIENTS.BROKER,
      PROMOTION_EMAIL_RECIPIENTS.BROKERS,
      PROMOTION_EMAIL_RECIPIENTS.PROMOTER,
    ],
  },
  {
    description: [
      'Nouvelle convention de réservation -> Client',
      'Nouvelle convention de réservation -> Pros',
    ],
    method: promotionOptionUploadAgreement,
    emailId: EMAIL_IDS.NEW_RESERVATION_AGREEMENT_PRO,
    recipients: [
      {
        type: PROMOTION_EMAIL_RECIPIENTS.USER,
        emailId: EMAIL_IDS.NEW_RESERVATION_AGREEMENT_USER,
      },
      PROMOTION_EMAIL_RECIPIENTS.BROKER,
      PROMOTION_EMAIL_RECIPIENTS.BROKERS,
      PROMOTION_EMAIL_RECIPIENTS.PROMOTER,
    ],
  },
  {
    description: [
      'Vérification e-Potek validée -> Client',
      'Vérification e-Potek validée -> Pro',
    ],
    method: setPromotionOptionProgress,
    shouldSend: ({ params: { id }, result: { nextStatus } }) =>
      id === 'simpleVerification' &&
      nextStatus === PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED,
    recipients: [
      {
        type: PROMOTION_EMAIL_RECIPIENTS.USER,
        emailId: EMAIL_IDS.SIMPLE_VERIFICATION_VALIDATED_USER,
      },
      {
        type: PROMOTION_EMAIL_RECIPIENTS.BROKER,
        emailId: EMAIL_IDS.SIMPLE_VERIFICATION_VALIDATED_PRO,
      },
    ],
  },
  {
    description: [
      'Vérification e-Potek refusée -> Client',
      'Vérification e-Potek refusée -> Pro',
    ],
    method: setPromotionOptionProgress,
    shouldSend: ({ params: { id }, result: { nextStatus } }) =>
      id === 'simpleVerification' &&
      nextStatus === PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.REJECTED,
    recipients: [
      {
        type: PROMOTION_EMAIL_RECIPIENTS.USER,
        emailId: EMAIL_IDS.SIMPLE_VERIFICATION_REJECTED_USER,
      },
      {
        type: PROMOTION_EMAIL_RECIPIENTS.BROKER,
        emailId: EMAIL_IDS.SIMPLE_VERIFICATION_REJECTED_PRO,
      },
    ],
  },
  {
    description: 'Envoi du dossier à la banque -> Courtier, Promoteur',
    method: setPromotionOptionProgress,
    shouldSend: ({ params: { id }, result: { nextStatus } }) =>
      id === 'bank' && nextStatus === PROMOTION_OPTION_BANK_STATUS.SENT,
    recipients: [
      PROMOTION_EMAIL_RECIPIENTS.BROKER,
      PROMOTION_EMAIL_RECIPIENTS.PROMOTER,
    ],
    emailId: EMAIL_IDS.PROMOTION_LOAN_SENT_TO_BANK,
  },
  {
    description: [
      'Validation de la banque -> Client',
      'Validation de la banque -> Courtier, Promoteur',
    ],
    method: setPromotionOptionProgress,
    shouldSend: ({ params: { id }, result: { nextStatus } }) =>
      id === 'bank' &&
      (nextStatus === PROMOTION_OPTION_BANK_STATUS.VALIDATED ||
        nextStatus === PROMOTION_OPTION_BANK_STATUS.VALIDATED_WITH_CONDITIONS),
    recipients: [
      {
        type: PROMOTION_EMAIL_RECIPIENTS.USER,
        emailId: EMAIL_IDS.LOAN_VALIDATED_BY_BANK_USER,
      },
      PROMOTION_EMAIL_RECIPIENTS.BROKER,
      PROMOTION_EMAIL_RECIPIENTS.PROMOTER,
    ],
    emailId: EMAIL_IDS.LOAN_VALIDATED_BY_BANK_PRO,
  },
];

export const mapConfigToListener = ({
  emailId,
  recipients,
  shouldSend = () => true,
}) => (...args) => {
  if (!shouldSend(...args)) {
    return;
  }

  const [
    {
      params: { promotionOptionId },
    },
  ] = args;

  const emailRecipients = PromotionOptionService.getEmailRecipients({
    promotionOptionId,
  });

  recipients.forEach(recipientConfig => {
    let type;
    let emailIdOverride;
    let getEmailParamsOverride;

    if (typeof recipientConfig === 'string') {
      type = recipientConfig;
    } else {
      type = recipientConfig.type;
      emailIdOverride = recipientConfig.emailId;
      getEmailParamsOverride = recipientConfig.getEmailParams;
    }

    if (!emailRecipients[type]) {
      return;
    }

    emailRecipients[type].forEach(recipient => {
      const { userId } = recipient;
      const emailParams = getEmailParamsOverride
        ? getEmailParamsOverride(...args, recipient)
        : getPromotionOptionMailParams(...args, recipient);

      internalMethod(() =>
        sendEmail.run({
          emailId: emailIdOverride || emailId,
          userId,
          params: emailParams,
        }),
      );
    });
  });
};
