const cfenv = require('cfenv');
const settings = require('./settings-production.json');

// export CF env vars for meteor
const mongoServiceName = 'mongo-production'; // Must be the same as in manifest.yml !
const appEnv = cfenv.getAppEnv();
process.env.NODE_ENV = 'production';
process.env.ROOT_URL = appEnv.url;
process.env.MONGO_URL = appEnv.getService(mongoServiceName).credentials.uri;
process.env.METEOR_SETTINGS = JSON.stringify(settings);

// PORT is set correctly by cloud foundry

// launch the bundle's main.js
require('./bundle/main.js');
