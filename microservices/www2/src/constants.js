let EPOTEK_APP = 'http://localhost:4000';
let EPOTEK_PRO = 'http://localhost:4100';
let EPOTEK_BACKEND = 'http://localhost:5500';

if (process.env.NODE_ENV === 'production') {
  EPOTEK_APP = 'https://app.e-potek.ch';
  EPOTEK_PRO = 'https://pro.e-potek.ch';
  EPOTEK_BACKEND = 'https://backend.e-potek.ch';
}

export { EPOTEK_APP, EPOTEK_PRO, EPOTEK_BACKEND };
