const sh = require('shelljs');
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
  appName: _appName,
  hooks = {},
  envVars = {},
  stickySessions = true,
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

  const lockRemoved = false;

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
        prepareBundleLocally: microservice !== 'backend',
        useBuildKit: true,
        stopAppDuringPrepareBundle: false,

        // Needed for core dumps
        args: ['--cap-add=SYS_PTRACE', '--ulimit core=-1'],
      },
      deployCheckWaitTime: 300,
      enableUploadProgressBar: true,
    },

    privateDockerRegistry: {
      host: 'https://eu.gcr.io',
      imagePrefix: 'eu.gcr.io/e-potek-1499177443071',
      username: '_json_key',
      password: JSON.stringify(REGISTRY_PASSWORD),
    },

    proxy: {
      loadBalancing: true,
      stickySessions,
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

    plugins: ['mup-netdata', 'mup-deploy-notifications'],

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

    deployNotifications: {
      slackWebhookUrl:
        'https://hooks.slack.com/services/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',
      slackChannel: '#team-engineering',
    },

    hooks: {
      // "reconfig" is the command that updates the
      // env vars (including METEOR_SETTINGS) and other app configuration
      // It is also run during deploys.
      'pre.reconfig': function (api) {
        // eslint-disable-next-line no-param-reassign
        api.settings = retrieveSecret(`${environment}-meteor-settings`);
      },
      'pre.setup': async function (api) {
        sh.set('-e');

        // Update atlas whitelist
        const cwd = process.cwd();
        sh.cd(`${__dirname}/../`);
        sh.exec(`node update-atlas-whitelist.js`);
        sh.cd(cwd);

        // Start logging container
        const command = `
          # If you need to change settings for the papertrail-logs container
          # Uncomment the following line so it is recreated
          # docker rm -f papertrail-logs;
          docker run --restart=always -d --name papertrail-logs \
          -e "SYSLOG_HOSTNAME=$HOSTNAME" \
          -v=/var/run/docker.sock:/var/run/docker.sock gliderlabs/logspout  \
          syslog+tls://logs7.papertrailapp.com:31301 || echo "container already running"
        `;

        const promises = Object.keys(api.getConfig().app.servers)
          .map(serverName => api.getSessionsForServers([serverName]))
          .map(([session]) => api.runSSHCommand(session, command))
          .map(promise =>
            promise.then(({ output, host, code }) => {
              if (code > 0 || !output.includes('container already running')) {
                console.log(`Starting container failed on ${host}:`);
                console.log(output);
              } else {
                console.log(`Logging container running on ${host}`);
              }
            }),
          );

        await Promise.all(promises);
      },
      ...hooks,
    },
  };
};
