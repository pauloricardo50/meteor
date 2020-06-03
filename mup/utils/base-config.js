const {
  removePrepareBundleLock,
  getPrepareBundleLock,
} = require('./prepare-bundle-lock');
const { retrieveSecret } = require('./secrets');

const { generateConfig } = require('./nginx.js');

process.env.METEOR_PACKAGE_DIRS =
  process.env.METEOR_PACKAGE_DIRS || '../../meteorPackages:packages';
process.env.METEOR_PROFILE = 1000;
process.env.METEOR_DISABLE_OPTIMISTIC_CACHING = 'true';

const enableLock = process.env.EPOTEK_RUN_PARALLEL === 'true';

const BASE_MONGO_URL = retrieveSecret('base-mongo-url');
const REGISTRY_PASSWORD = retrieveSecret('registry-password');

module.exports = function createConfig({
  microservice,
  subDomains,
  nginxLocationConfig,
  environment,
  baseDomain,
  servers,
  globalApiConfig,
  parallelPrepareBundle,
  appName: _appName,
  hooks = {},
  envVars = {},
}) {
  const appName = _appName || microservice;

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
  const name = `${appName}-${environment}`;

  const domains = subDomains.map(subdomain => `${subdomain}.${baseDomain}`);

  let lockRemoved = false;

  return {
    servers: {
      ...servers,
      netdata: {
        host: '34.65.136.43',
        username: 'mup',
        pem: '~/.ssh/epotek',
      },
    },

    app: {
      name,
      path,
      servers: appServers,

      buildOptions: {
        serverOnly: true,
      },

      env: {
        ROOT_URL: `https://${domains[0]}`,
        MONGO_URL: `${BASE_MONGO_URL}/${environment}?retryWrites=true&w=majority`,
        MONGO_OPLOG_URL: `${BASE_MONGO_URL}/local`,
        DDP_DEFAULT_CONNECTION_URL: `https://backend.${baseDomain}`,
        ...envVars,
      },

      docker: {
        image: 'zodern/meteor',
        prepareBundle: true,
        useBuildKit: true,
        stopAppDuringPrepareBundle: false,

        // Needed for core dumps
        args: ['--cap-add=SYS_PTRACE', '--ulimit core=-1'],
      },
      deployCheckWaitTime: 300,
      enableUploadProgressBar: true,
    },

    // privateDockerRegistry: {
    //   host: 'https://eu.gcr.io',
    //   imagePrefix: 'eu.gcr.io/e-potek-1499177443071',
    //   username: '_json_key',
    //   password: JSON.stringify(REGISTRY_PASSWORD),
    // },

    proxy: {
      loadBalancing: true,
      domains: domains.join(','),
      nginxLocationConfig: nginxLocationConfig
        ? generateConfig(nginxLocationConfig, baseDomain)
        : undefined,
      shared: {
        nginxConfig: generateConfig(
          '../nginx/global.conf',
          baseDomain,
          globalApiConfig,
        ),
      },
    },

    plugins: ['mup-netdata'],

    netdata: {
      servers: {
        ...Object.keys(servers).reduce((result, serverName) => {
          // eslint-disable-next-line no-param-reassign
          result[serverName] = {};

          return result;
        }, {}),
        netdata: {
          master: true,
        },
      },
      apiKey: '3e8f196e-38ad-4879-89e3-e5243bb07cb1',
    },

    hooks: {
      // "reconfig" is the command that updates the
      // env vars (including METEOR_SETTINGS) and other app configuration
      // It is also run during deploys.
      'pre.reconfig': function(api) {
        // eslint-disable-next-line no-param-reassign
        api.settings = retrieveSecret(`${environment}-meteor-settings`);
      },
      'post.setup': {
        remoteCommand: `
          # If you need to change settings for the papertrail-logs container
          # Uncomment the following line so it is recreated
          # docker rm -f papertrail-logs; 
          docker run --restart=always -d --name papertrail-logs \
          -e "SYSLOG_HOSTNAME=$HOSTNAME" \
          -v=/var/run/docker.sock:/var/run/docker.sock gliderlabs/logspout  \
          syslog+tls://logs7.papertrailapp.com:31301
        `,
      },

      'post.meteor.build': async function(api) {
        if (parallelPrepareBundle || !enableLock) {
          return false;
        }

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
        if (parallelPrepareBundle || !enableLock) {
          return false;
        }

        removePrepareBundleLock();
        lockRemoved = true;
      },
      ...hooks,
    },
  };
};
