process.env.METEOR_PACKAGE_DIRS =
  process.env.METEOR_PACKAGE_DIRS || '../../meteorPackages:packages';
process.env.METEOR_PROFILE = 50;
process.env.METEOR_DISABLE_OPTIMISTIC_CACHING = 'true';
const servers = require('../staging-servers.json');

const BASE_DOMAIN = 'staging-2.e-potek.net';
const ENVIRONMENT = 'staging';

module.exports = function createConfig({
  microservice,
  subDomains,
  nginxLocationConfig,
}) {
  const appServers = Object.keys(servers).reduce((result, serverName) => {
    // eslint-disable-next-line no-param-reassign
    result[serverName] = {};
    return result;
  }, {});
  const path = `../../microservices/${microservice}`;
  const name = `${microservice}-${ENVIRONMENT}`;

  const domains = subDomains.map(subdomain => `${subdomain}.${BASE_DOMAIN}`);

  return {
    servers,

    app: {
      name,
      path,
      servers: appServers,

      buildOptions: {
        serverOnly: true,
      },

      env: {
        ROOT_URL: `http://${domains[0]}`,
        MONGO_URL:
          'mongodb+srv://staging-access:hYeXNTdaue54qYuC@cluster0-rcyrm.gcp.mongodb.net/e-potek?retryWrites=true&w=majority',
        MONGO_OPLOG_URL:
          'mongodb+srv://staging-access:hYeXNTdaue54qYuC@cluster0-rcyrm.gcp.mongodb.net/local',
        DDP_DEFAULT_CONNECTION_URL: 'http://backend.staging-2.e-potek.net',
      },

      docker: {
        image: 'zodern/meteor:root',
        prepareBundle: false,
      },
      deployCheckWaitTime: 300,
      enableUploadProgressBar: true,
    },

    proxy: {
      domains: domains.join(','),
      nginxLocationConfig,
      shared: {
        nginxConfig: '../nginx/global-staging.conf',
      },
    },
  };
};
