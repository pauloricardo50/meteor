// Not actually used to create a meteor collection, but useful to switch()
// on collection names
export const USERS_COLLECTION = 'users';

export const ROLES = {
  ADMIN: 'admin',
  DEV: 'dev',
  USER: 'user',
  PRO: 'pro',
};

export const USER_QUERIES = {
  ADMIN_USERS: 'ADMIN_USERS',
  APP_USER: 'APP_USER',
  CURRENT_USER: 'CURRENT_USER',
  PRO_REFERRED_BY: 'PRO_REFERRED_BY',
  PRO_USER: 'PRO_USER',
  REFERRED_USERS: 'REFERRED_USERS',
  USER_EMAILS: 'USER_EMAILS',
  USER_SEARCH: 'USER_SEARCH',
};

export const USER_EVENTS = {
  USER_CREATED: 'USER_CREATED',
};

export const LOCAL_STORAGE_REFERRAL = 'REFERRAL_ID';
export const LOCAL_STORAGE_OLD_REFERRAL = 'OLD_REFERRAL_ID';

export const ACQUISITION_CHANNELS = {
  REFERRAL_PRO: 'REFERRAL_PRO',
  REFERRAL_ADMIN: 'REFERRAL_ADMIN',
  REFERRAL_API: 'REFERRAL_API',
  GOOGLE: 'GOOGLE',
  NEWSLETTER: 'NEWSLETTER',
  FRIENDS: 'FRIENDS',
  ADVERTISING: 'ADVERTISING',
  SOCIAL_MEDIA: 'SOCIAL_MEDIA',
  PAPER_ARTICLE: 'PAPER_ARTICLE',
  "Tout l'immobilier": "Tout l'immobilier",
  WEBSITE: 'WEBSITE',
};
