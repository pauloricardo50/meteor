const {
  removePrepareBundleLock,
  getPrepareBundleLock,
} = require('./prepare-bundle-lock');

const { generateConfig } = require('./nginx.js');

process.env.METEOR_PACKAGE_DIRS =
  process.env.METEOR_PACKAGE_DIRS || '../../meteorPackages:packages';
process.env.METEOR_PROFILE = 1000;
process.env.METEOR_DISABLE_OPTIMISTIC_CACHING = 'true';

const enableLock = process.env.EPOTEK_RUN_PARALLEL === 'true';

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
      password: JSON.stringify(require('../configs/registry-key.json')),
    },

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

    hooks: {
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
