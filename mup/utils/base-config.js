const { generateConfig } = require('./nginx.js');

process.env.METEOR_PACKAGE_DIRS =
  process.env.METEOR_PACKAGE_DIRS || '../../meteorPackages:packages';
process.env.METEOR_PROFILE = 1000;
process.env.METEOR_DISABLE_OPTIMISTIC_CACHING = 'true';

module.exports = function createConfig({
  microservice,
  subDomains,
  nginxLocationConfig,
  environment,
  baseDomain,
  servers,
}) {
  const appServers = Object.keys(servers).reduce((result, serverName) => {
    // eslint-disable-next-line no-param-reassign
    result[serverName] = {};
    return result;
  }, {});
  const path = `../../microservices/${microservice}`;
  const name = `${microservice}-${environment}`;

  const domains = subDomains.map(subdomain => `${subdomain}.${baseDomain}`);

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
        ROOT_URL: `https://${domains[0]}`,
        MONGO_URL:
          'mongodb+srv://staging-access:hYeXNTdaue54qYuC@cluster0-rcyrm.gcp.mongodb.net/e-potek?retryWrites=true&w=majority',
        MONGO_OPLOG_URL:
          'mongodb+srv://staging-access:hYeXNTdaue54qYuC@cluster0-rcyrm.gcp.mongodb.net/local',
        DDP_DEFAULT_CONNECTION_URL: `https://backend.${baseDomain}`,
      },

      docker: {
        image: 'zodern/meteor',
        prepareBundle: true,
        useBuildKit: true,
      },
      deployCheckWaitTime: 300,
      enableUploadProgressBar: true,
    },

    privateDockerRegistry: {
      host: 'https://eu.gcr.io',
      imagePrefix: 'eu.gcr.io/e-potek-1499177443071',
      username: '_json_key',
      password: JSON.stringify(require('../configs/registry-key.json')),
    },

    proxy: {
      domains: domains.join(','),
      nginxLocationConfig: nginxLocationConfig
        ? generateConfig(nginxLocationConfig, baseDomain)
        : undefined,
      shared: {
        nginxConfig: generateConfig('../nginx/global.conf', baseDomain),
      },
    },
  };
};
