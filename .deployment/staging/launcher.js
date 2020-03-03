const cfenv = require('cfenv');
const settings = require('./settings-staging.json');

// export CF env vars for meteor
const appEnv = cfenv.getAppEnv();
process.env.NODE_ENV = 'production';
process.env.ROOT_URL = appEnv.url;
process.env.MONGO_URL =
  'mongodb+srv://staging-access:hYeXNTdaue54qYuC@cluster0-rcyrm.gcp.mongodb.net/staging?retryWrites=true&w=majority';
process.env.METEOR_SETTINGS = JSON.stringify(settings);

if (!appEnv.name.includes('backend')) {
  process.env.DDP_DEFAULT_CONNECTION_URL = 'https://backend.staging.e-potek.ch';
}

// launch the bundle's main.js
require('./bundle/main.js');
