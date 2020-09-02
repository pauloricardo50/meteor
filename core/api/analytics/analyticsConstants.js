export const TRACKING_COOKIE = 'epotek_trackingid';

// e-Potek's office and VPN IPs
// Those addresses are blacklisted from 'app' and 'pro' tracked events
// to avoid wrong tracking when impersonating users
export const LOGIN_IP_BLACKLIST = ['213.3.47.70'];

export const CTA_ID = {
  ACCOUNT_CREATION_NAVBAR: 'Account creation navbar',
  ACCOUNT_CREATION_RESULT_SCREEN: 'Account creation result screen',
  ACCOUNT_CREATION_RESULT_SCREEN_TOP: 'Account creation result screen top',
  LOGIN_NAVBAR: 'Login navbar',
  CALENDLY_TYPE_STEP: 'Calendy type step',
  CALENDLY_BORROWERS_STEP: 'Calendy borrowers step',
  CALENDLY_CANTON_STEP: 'Calendy canton step',
  CALENDLY_RESULT_SCREEN: 'Calendy result screen',
  GET_STARTED_RESULT_SCREEN: 'Get started result screen',
};
