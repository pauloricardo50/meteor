import { Meteor } from 'meteor/meteor';

export const FROM_NAME = 'e-Potek';
export const FROM_EMAIL = 'info@e-potek.ch';
export const FROM_DEFAULT = `${FROM_NAME} <${FROM_EMAIL}>`;
export const CTA_URL_DEFAULT = Meteor.settings.public.subdomains.app;
export const INTERNAL_EMAIL = Meteor.settings.public.environment === 'production'
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
    mandrillId: 'notification',
    variables: {
      TITLE: 'TITLE',
      BODY: 'BODY',
    },
  },
  NOTIFICATION_AND_CTA: {
    name: 'NOTIFICATION_AND_CTA',
    mandrillId: 'notification-cta',
    variables: {
      TITLE: 'TITLE',
      BODY: 'BODY',
      CTA: 'CTA',
      CTA_URL: 'CTA_URL',
    },
  },
  PROMOTION_INVITATION: {
    name: 'PROMOTION_INVITATION',
    mandrillId: 'promotion-invitation',
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
  CONTACT_US: 'CONTACT_US',
  CONTACT_US_ADMIN: 'CONTACT_US_ADMIN',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
  RESET_PASSWORD: 'RESET_PASSWORD',
  ENROLL_ACCOUNT: 'ENROLL_ACCOUNT',
  VERIFICATION_REQUESTED: 'VERIFICATION_REQUESTED',
  VERIFICATION_ERROR: 'VERIFICATION_ERROR',
  VERIFICATION_PASSED: 'VERIFICATION_PASSED',
  INVITE_USER_TO_PROMOTION: 'INVITE_USER_TO_PROMOTION',
  SEND_FEEDBACK_TO_LENDER: 'SEND_FEEDBACK_TO_LENDER',
  INVITE_USER_TO_PROPERTY: 'INVITE_USER_TO_PROPERTY',
  REFER_USER: 'REFER_USER',
  FIND_LENDER_NOTIFICATION: 'FIND_LENDER_NOTIFICATION',
  CONFIRM_USER_INVITATION: 'CONFIRM_USER_INVITATION',
};
