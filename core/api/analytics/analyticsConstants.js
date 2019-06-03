export const TRACKING_COOKIE = 'epotek_trackingid';

// e-Potek's office and VPN IPs
// Those addresses are blacklisted from 'app' and 'pro' tracked events
// to avoid wrong tracking when impersonating users
export const LOGIN_IP_BLACKLIST = ['185.19.31.79', '213.3.47.70'];
