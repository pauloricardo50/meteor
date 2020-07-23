import { ACQUISITION_CHANNELS } from '../users/userConstants';

export const DRIP_TAGS = {
  TEST: 'test',
  PROMO: 'promo',
  ORGANIC: 'organic',
  CALENDLY: 'calendly',
  LOST: 'lost',
  QUALIFIED: 'qualified',
  [ACQUISITION_CHANNELS.REFERRAL_API]: 'referral_API',
  [ACQUISITION_CHANNELS.REFERRAL_ORGANIC]: 'referral_organic',
  [ACQUISITION_CHANNELS.REFERRAL_PRO]: 'referral_pro',
};

export const DRIP_ACTIONS = {
  USER_CREATED: 'User created',
  USER_VALIDATED: 'User validated',
  USER_QUALIFIED: 'User qualified',
  TEST_ACTION: 'Test action',
};
