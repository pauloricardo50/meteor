import { Meteor } from 'meteor/meteor';

export const FROM_NAME = "Yannis d'e-Potek";
export const FROM_EMAIL = 'info@e-potek.ch';
export const FROM_DEFAULT = `${FROM_NAME} <${FROM_EMAIL}>`;
export const CTA_URL_DEFAULT = Meteor.settings.public.subdomains.app;
export const INTERNAL_EMAIL = Meteor.settings.public.environment === 'production'
  ? FROM_EMAIL
  : 'dev@e-potek.ch';

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
  AUCTION_STARTED: 'AUCTION_STARTED',
  AUCTION_ENDED: 'AUCTION_ENDED',
  AUCTION_CANCELLED: 'AUCTION_CANCELLED',
};
