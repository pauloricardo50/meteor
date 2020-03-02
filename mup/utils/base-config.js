const {
  removePrepareBundleLock,
  getPrepareBundleLock,
} = require('./prepare-bundle-lock');

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
  const appServers = Object.keys(servers)
    // Randomize the order so all apps don't run Prepare Bundle on the same server
    // during parallel deploys
    .sort(() => Math.random())
    .reduce((result, serverName) => {
      // eslint-disable-next-line no-param-reassign
      result[serverName] = {};
      return result;
    }, {});
  const path = `../../microservices/${microservice}`;
  const name = `${microservice}-${environment}`;

  const domains = subDomains.map(subdomain => `${subdomain}.${baseDomain}`);

  let lockRemoved = false;

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
        MONGO_URL: `mongodb+srv://staging-access:hYeXNTdaue54qYuC@cluster0-rcyrm.gcp.mongodb.net/${environment}?retryWrites=true&w=majority`,
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
      loadBalancing: true,
      domains: domains.join(','),
      nginxLocationConfig: nginxLocationConfig
        ? generateConfig(nginxLocationConfig, baseDomain)
        : undefined,
      shared: {
        nginxConfig: generateConfig('../nginx/global.conf', baseDomain),
      },
    },

    hooks: {
      'post.meteor.build': async function(api) {
        const history = api.commandHistory;

        // Check for `mup meteor push`, which calls `mup meteor build` as part of a deploy
        if (!history.find(entry => entry.name === 'meteor.push')) {
          return;
        }

        console.log('Waiting for lock');
        await getPrepareBundleLock();
        console.log('Has lock');

        process.on('exit', () => {
          if (!lockRemoved) {
            console.log('lock removed on exit');
            removePrepareBundleLock();
          }
        });
      },
      'post.meteor.push': function() {
        removePrepareBundleLock();
        lockRemoved = true;
      },
    },
  };
};
