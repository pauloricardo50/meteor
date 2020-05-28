import { Meteor } from 'meteor/meteor';

export const FROM_NAME = 'e-Potek';
export const FROM_EMAIL = 'team@e-potek.ch';
export const FROM_DEFAULT = `${FROM_NAME} <${FROM_EMAIL}>`;
export const CTA_URL_DEFAULT = Meteor.settings.public.subdomains.app;
export const INTERNAL_EMAIL =
  Meteor.settings.public.environment === 'production'
    ? FROM_EMAIL
    : 'dev@e-potek.ch';
export const EPOTEK_PHONE = '+41 22 566 01 10';

export const EMAIL_I18N_NAMESPACE = 'emails';

export const EMAIL_PARTS = {
  SUBJECT: 'SUBJECT',
  TITLE: 'TITLE',
  BODY: 'BODY',
  CTA: 'CTA',
  FROM: 'FROM',
};

export const FOOTER_TYPES = {
  USER: 'footerUser',
  VISITOR: 'footerVisitor',
};

export const EMAIL_TEMPLATES = {
  NOTIFICATION: {
    name: 'NOTIFICATION',
    mandrillId: 'notification-v4',
    variables: {
      TITLE: 'TITLE',
      BODY: 'BODY',
    },
    customTemplateContent: { 'body-content-1': 'body-content-1' },
  },
  NOTIFICATION_AND_CTA: {
    name: 'NOTIFICATION_AND_CTA',
    mandrillId: 'notification-cta-v5',
    variables: {
      CSS: 'CSS',
      TITLE: 'TITLE',
      BODY: 'BODY',
      CTA: 'CTA',
      CTA_URL: 'CTA_URL',
    },
    customTemplateContent: { 'body-content-1': 'body-content-1' },
  },
  PROMOTION_INVITATION: {
    name: 'PROMOTION_INVITATION',
    mandrillId: 'promotion-invitation-v2',
    variables: {
      TITLE: 'TITLE',
      MARKETING_BLURB: 'MARKETING_BLURB',
      BODY: 'BODY',
      CTA: 'CTA',
      CTA_URL: 'CTA_URL',
      COVER_IMAGE_URL: 'COVER_IMAGE_URL',
      LOGO_URL_1: 'LOGO_URL_1',
      LOGO_URL_2: 'LOGO_URL_2',
      LOGO_URL_3: 'LOGO_URL_3',
    },
    customTemplateContent: { logos: 'logos', footer: 'footer' },
  },
  SIMPLE: {
    name: 'SIMPLE',
    mandrillId: 'simple',
    variables: {
      TITLE: 'TITLE',
      BODY: 'BODY',
    },
  },
};

export const EMAIL_IDS = {
  CANCEL_PROMOTION_LOT_RESERVATION: 'CANCEL_PROMOTION_LOT_RESERVATION',
  CANCEL_PROMOTION_LOT_RESERVATION_PROCESS:
    'CANCEL_PROMOTION_LOT_RESERVATION_PROCESS',
  CONFIRM_PROMOTION_USER_INVITATION: 'CONFIRM_PROMOTION_USER_INVITATION',
  CONFIRM_USER_INVITATION: 'CONFIRM_USER_INVITATION',
  CONTACT_US_ADMIN: 'CONTACT_US_ADMIN',
  CONTACT_US: 'CONTACT_US',
  ENROLL_ACCOUNT: 'ENROLL_ACCOUNT',
  EXPIRE_PROMOTION_RESERVATION_AGREEMENT:
    'EXPIRE_PROMOTION_RESERVATION_AGREEMENT',
  FIND_LENDER_NOTIFICATION: 'FIND_LENDER_NOTIFICATION',
  INVITE_USER_TO_PROMOTION: 'INVITE_USER_TO_PROMOTION',
  INVITE_USER_TO_PROPERTY: 'INVITE_USER_TO_PROPERTY',
  LOAN_CHECKLIST: 'LOAN_CHECKLIST',
  LOAN_VALIDATED_BY_BANK_PRO: 'LOAN_VALIDATED_BY_BANK_PRO',
  LOAN_VALIDATED_BY_BANK_USER: 'LOAN_VALIDATED_BY_BANK_USER',
  NEW_RESERVATION_AGREEMENT_PRO: 'NEW_RESERVATION_AGREEMENT_PRO',
  NEW_RESERVATION_AGREEMENT_USER: 'NEW_RESERVATION_AGREEMENT_USER',
  PRO_NOTE_NOTIFICATION: 'PRO_NOTE_NOTIFICATION',
  PRO_NOTE_NOTIFICATION_NO_CTA: 'PRO_NOTE_NOTIFICATION_NO_CTA',
  PROMOTION_LOAN_SENT_TO_BANK: 'PROMOTION_LOAN_SENT_TO_BANK',
  PROMOTION_RESERVATION_ACTIVATION: 'PROMOTION_RESERVATION_ACTIVATION',
  REFER_USER: 'REFER_USER',
  RESERVE_PROMOTION_LOT_USER: 'RESERVE_PROMOTION_LOT_USER',
  RESERVE_PROMOTION_LOT: 'RESERVE_PROMOTION_LOT',
  RESET_PASSWORD: 'RESET_PASSWORD',
  SELL_PROMOTION_LOT_USER: 'SELL_PROMOTION_LOT_USER',
  SELL_PROMOTION_LOT: 'SELL_PROMOTION_LOT',
  SEND_FEEDBACK_TO_LENDER: 'SEND_FEEDBACK_TO_LENDER',
  SIMPLE_VERIFICATION_REJECTED_PRO: 'SIMPLE_VERIFICATION_REJECTED_PRO',
  SIMPLE_VERIFICATION_REJECTED_USER: 'SIMPLE_VERIFICATION_REJECTED_USER',
  SIMPLE_VERIFICATION_VALIDATED_PRO: 'SIMPLE_VERIFICATION_VALIDATED_PRO',
  SIMPLE_VERIFICATION_VALIDATED_USER: 'SIMPLE_VERIFICATION_VALIDATED_USER',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
};

export const EMAIL_QUERIES = {
  RECENT_NEWSLETTERS: 'RECENT_NEWSLETTERS',
};

export const MAILCHIMP_LIST_STATUS = {
  SUBSCRIBED: 'subscribed',
  UNSUBSCRIBED: 'unsubscribed',
};
