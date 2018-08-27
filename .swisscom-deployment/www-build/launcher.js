const cfenv = require("cfenv")
const settings = require('./settings-staging.json')

// export CF env vars for meteor
const mongoServiceName = 'meteor-mongo';
const appEnv = cfenv.getAppEnv()
process.env.ROOT_URL = appEnv.url;
process.env.MONGO_URL = appEnv.getService(mongoServiceName).credentials.uri;
process.env.METEOR_SETTINGS = JSON.stringify(settings);

// PORT is set correctly by cloud foundry

// launch the bundle's main.js
require('./bundle/main.js');
