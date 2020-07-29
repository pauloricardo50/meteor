import merge from 'lodash/merge';

import writeYAML from '../scripts/writeYAML';

const WORKING_DIRECTORY = '/home/circleci/app';
const CACHE_VERSION = 'master_16'; // Use a different branch name if you're playing with the cache version outside of master, only use underscores here, no hyphens
const STAGING_BRANCH = 'staging';

const defaultJobValues = {
  working_directory: WORKING_DIRECTORY,
  docker: [
    {
      image: 'cypress/base:12', // Has Node installed with dependencies to run cypress
      environment: {
        // LANG variables are necessary for meteor to work well
        LANG: 'C.UTF-8',
        LANGUAGE: 'C.UTF-8',
        LC_ALL: 'C.UTF-8',
        LC_NUMERIC: 'en_US.UTF-8',
        METEOR_VERSION: '1.10.2',
        NODE_ENV: 'development', // Some packages require this during tests
        TOOL_NODE_FLAGS:
          '--max_old_space_size=8192 --optimize_for_size --gc_interval=100 --min_semi_space_size=8 --max_semi_space_size=256', // NodeJS kung-fu to make your builds run faster, without running out of memory
        // METEOR_PROFILE: 100, // If you need to debug meteor, set this to a number (in ms)
        CIRCLE_CI: 1, // Helpful in your tests, to know whether you're in circle CI or not
        DEBUG: false, // Helps
        METEOR_ALLOW_SUPERUSER: true, // Required when running meteor in docker
        // QUALIA_PROFILE_FOLDER: './profiles', // If you want to store qualia profiles
        METEOR_DISABLE_OPTIMISTIC_CACHING: 1, // big speed issue https://github.com/meteor/meteor/issues/10786
        RTL_SKIP_AUTO_CLEANUP: 1,
        HOME: '/home/circleci', // parts of CirceCI are hard coded to use /home/circleci, but cypress installs to $HOME
      },
    },
  ],
};

// Cache keys should have an identifier string at the start, using only _ to separate words
// and it should include the CACHE_VERSION, so all cache can be flushed at once by incrementing CACHE_VERSION
// like: "my_cache_name_${CACHE_VERSION}"
// Then follow with the variable identifiers, each separated by a hyphen "-"
const cacheKeys = {
  global: () =>
    `global_${CACHE_VERSION}_2-{{ checksum "./package-lock.json" }}`,
  meteorSystem: name =>
    `meteor_system_${CACHE_VERSION}_${name}_2_{{ checksum "./microservices/${name}/.meteor/release" }}_{{ checksum "./microservices/${name}/.meteor/versions" }}`,
  meteorMicroservice: name =>
    `meteor_microservice_${CACHE_VERSION}_${name}-{{ .Branch }}-{{ .Revision }}`,
  minifierCache: name =>
    `minifier_microservice_${CACHE_VERSION}_${name}-{{ .Branch }}-{{ .Revision }}`,
  nodeModules: () =>
    `node_modules_${CACHE_VERSION}_{{ checksum "./package-lock.json" }}`,
  source: () => `source_${CACHE_VERSION}-{{ .Branch }}-{{ .Revision }}`,
  gatsby: () => `source_${CACHE_VERSION}-{{ .Branch }}-{{ .Revision }}`
};

const cachePaths = {
  global: () => '/home/circleci/.cache',
  meteorSystem: () => '/home/circleci/.meteor',
  meteorMicroservice: name => [
    `./microservices/${name}/.meteor/local/bundler-cache/scanner`,
    `./microservices/${name}/.meteor/local/isopacks`,
    `./microservices/${name}/.meteor/local/plugin-cache`,
    `./microservices/${name}/.meteor/local/resolver-result-cache.json`,
  ],
  minifierCache: name =>
    `./microservices/${name}/.meteor/local/plugin-cache/zodern_standard-minifier-js`,
  nodeModules: () => './node_modules',
  source: () => '.',
  gatsby: () => ['./microservices/www2/.cache', './microservices/www2/public']
};

// Circle CI Commands
const runCommand = (name, command, timeout, background = false) => ({
  run: {
    name,
    command,
    ...(background ? { background: true } : {}),
    ...(timeout ? { no_output_timeout: timeout } : {}),
  },
});
const runTestsCommand = (name, testsType) => {
  switch (testsType) {
    case 'e2e':
      return runCommand(
        'Run e2e tests',
        `
        cd ./microservices/${name} && meteor npm run test-e2e-ci
        `,
        '30m',
      );
    case 'unit':
      return runCommand(
        'Run unit tests',
        `cd ./microservices/${name} && meteor npm run test-ci`,
        '30m',
      );
    default:
      throw new Error(`Unknown tests type: ${testsType}`);
  }
};
const restoreCache = (name, key) => ({
  restore_cache: {
    name,
    // Provide multiple, less accurate, cascading, keys for caching in case checksums fail
    // See circleCI docs: https://circleci.com/docs/2.0/caching/#restoring-cache
    keys: key
      .split(/(?!package)-(?!lock)/)
      .reduce(
        (keys, _, index, parts) => [
          ...keys,
          parts.slice(0, parts.length - index).join('-') +
            (index === 0 ? '' : '-'),
        ],
        [],
      ),
  },
});
const saveCache = (name, key, path) => ({
  save_cache: { name, key, paths: Array.isArray(path) ? path : [path] },
});
const storeTestResults = path => ({ store_test_results: { path } });
const storeArtifacts = path => ({ store_artifacts: { path } });

// Create preparation job with shared work
const makePrepareJob = () => ({
  ...defaultJobValues,
  resource_class: 'medium',
  steps: [
    // Update source cache with latest code
    restoreCache('Restore source', cacheKeys.source()),
    'checkout',
    runCommand(
      'Init submodules',
      'git submodule sync && git submodule update --init --recursive',
    ),
    saveCache('Cache source', cacheKeys.source(), cachePaths.source()),
    // Prepare node_modules cache
    restoreCache('Restore global cache', cacheKeys.global()),
    runCommand('Install project node_modules', 'npm ci'),
    saveCache('Cache globals', cacheKeys.global(), cachePaths.global()),
    saveCache(
      'Cache node_modules',
      cacheKeys.nodeModules(),
      cachePaths.nodeModules(),
    ),
  ],
});

// Create test job for a given microservice
const testMicroserviceJob = ({ name, testsType, job }) => ({
  ...defaultJobValues,
  ...job,
  resource_class: 'medium+',
  steps: [
    restoreCache('Restore source', cacheKeys.source()),
    testsType === 'e2e' &&
      restoreCache('Restore global cache', cacheKeys.global()),
    restoreCache('Restore node_modules', cacheKeys.nodeModules()),
    restoreCache('Restore meteor system', cacheKeys.meteorSystem()),
    restoreCache(
      'Restore meteor microservice',
      cacheKeys.meteorMicroservice(name),
    ),
    restoreCache(
      'Restore meteor backend',
      cacheKeys.meteorMicroservice('backend'),
    ),
    testsType === 'unit' &&
      runCommand(
        'Setup display',
        `
        echo "export DISPLAY=':99.0'" >> $BASH_ENV
        apt-get update && apt-get install xvfb -y
        Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1
      `,
        null,
        true,
      ),
    testsType === 'e2e' &&
      runCommand(
        'Install netcat',
        'apt-get update && apt-get install -y netcat',
      ),
    runCommand('Install meteor', './scripts/circleci/install_meteor.sh'),
    runCommand('Create results directory', 'mkdir ./results'),
    // runCommand(
    //   'Create profiles directory',
    //   `mkdir ./microservices/${name}/profiles`,
    // ),
    runCommand(
      'Install node_modules',
      `
      function installBackend {
        meteor npm --prefix microservices/${name} ci
        touch $HOME/.npm-backend-done
      }

      installBackend &

      ${
        name !== 'backend' ? 'meteor npm --prefix microservices/backend ci' : ''
      }

      until [ -f $HOME/.npm-backend-done ]; do
        echo "$HOME/.npm-backend-done does not exist. Waiting 1s"
        sleep 1
      done
      `,
    ),
    name !== 'backend' &&
      runCommand('Generate language files', `npm run lang ${name}`),
    runTestsCommand(name, testsType),
    saveCache(
      'Cache meteor system',
      cacheKeys.meteorSystem(name),
      cachePaths.meteorSystem(),
    ),
    saveCache(
      'Cache meteor microservice',
      cacheKeys.meteorMicroservice(name),
      cachePaths.meteorMicroservice(name),
    ),
    saveCache(
      'Cache meteor backend',
      cacheKeys.meteorMicroservice('backend'),
      cachePaths.meteorMicroservice('backend'),
    ),
    storeTestResults(testsType === 'e2e' ? './e2e-results' : './results'),
    storeArtifacts(testsType === 'e2e' ? './e2e-results' : './results'),
    // storeArtifacts(`./microservices/${name}/profiles`),
  ].filter(x => x),
});

const testGatsbyJob = () => ({
  ...defaultJobValues,
  steps: [
    restoreCache('Restore source', cacheKeys.source()),
    runCommand('Install node_modules', 'npm --prefix microservices/www2 ci'),
    runCommand('Run tests', 'npm run test-ci --prefix microservices/www2'),
  ],
});

const testGatsbyJobE2E = () => {
  const name = 'www2'
  return ({
  ...defaultJobValues,
  steps: [
    restoreCache('Restore source', cacheKeys.source()),
    restoreCache('Restore global cache', cacheKeys.global()),
    restoreCache('Restore node_modules', cacheKeys.nodeModules()),
    restoreCache('Restore meteor system', cacheKeys.meteorSystem()),
    restoreCache('Restore gatsby website', cacheKeys.gatsby()),
    restoreCache(
      'Restore meteor backend',
      cacheKeys.meteorMicroservice('backend'),
    ),
    runCommand(
      'Install netcat',
      'apt-get update && apt-get install -y netcat',
    ),
    runCommand('Install meteor', './scripts/circleci/install_meteor.sh'),
    runCommand('Create results directory', 'mkdir ./results'),
    runCommand(
      'Install node_modules',
      `
      function installBackend {
        meteor npm --prefix microservices/${name} ci
        touch $HOME/.npm-backend-done
      }

      installBackend &

      ${
        name !== 'backend' ? 'meteor npm --prefix microservices/backend ci' : ''
      }

      until [ -f $HOME/.npm-backend-done ]; do
        echo "$HOME/.npm-backend-done does not exist. Waiting 1s"
        sleep 1
      done
      `,
    ),

    runCommand(
      'Run E2E tests',
      `cd ./microservices/${name} && meteor npm run test-e2e`,
      '30m',
    ),

    saveCache(
      'Cache gatsby website',
      cacheKeys.gatsby(),
      cachePaths.gatsby(),
    ),

    saveCache(
      'Cache meteor backend',
      cacheKeys.meteorMicroservice('backend'),
      cachePaths.meteorMicroservice('backend'),
    ),
  ],
})};

const makeDeployJob = ({ name, job }) => ({
  ...job,
  ...defaultJobValues,
  steps: [
    'add_ssh_keys',
    {
      setup_remote_docker: {
        version: '19.03.12',
      },
    },
    restoreCache('Restore source', cacheKeys.source()),
    restoreCache('Restore node_modules', cacheKeys.nodeModules()),
    restoreCache('Restore meteor system', cacheKeys.meteorSystem(name)),
    restoreCache(
      'Restore meteor microservice',
      cacheKeys.meteorMicroservice(name),
    ),
    // The microservice cache only has files from building for development,
    // which doesn't minify
    restoreCache('Restore minifier cache', cacheKeys.minifierCache(name)),
    runCommand('Install meteor', './scripts/circleci/install_meteor.sh'),
    runCommand(
      'Install GCloud',
      `
      cd ~
      echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
      apt-get install apt-transport-https ca-certificates gnupg
      curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
      apt-get update && apt-get install -y google-cloud-sdk

      echo "$GCLOUD_SDK_KEY" > ./gcloud-key.json
      gcloud auth activate-service-account  --key-file=./gcloud-key.json
      rm ./gcloud-key.json
    `,
    ),
    runCommand('Install Docker', 'wget -qO- https://get.docker.com/ | sh'),
    runCommand(
      'Deploy',
      `
        cd deploy
        ENVIRONMENT="staging"

        if [ "$CIRCLE_BRANCH" = "${STAGING_BRANCH}" ]; then
          ENVIRONMENT="staging"
        else
          echo "Deployments not configured for this branch"
          exit 1
        fi

        # Uses the fingerprint as the name
        mv ~/.ssh/id_rsa_02c8ca4cac313d6026c95416de40b8b8 ~/.ssh/epotek
        node run-all -e $ENVIRONMENT --apps ${name} validate
        node run-all -e $ENVIRONMENT --apps ${name} deploy
      `,
      '30m',
    ),
    saveCache(
      'Save minifier cache',
      cacheKeys.minifierCache(name),
      cachePaths.minifierCache(name),
    ),
  ],
});

const testJobs = [
  'App - unit tests',
  'Admin - unit tests',
  'Core - unit tests',
  'App - e2e tests',
  'Admin - e2e tests',
  'Pro - e2e tests',
];

const deployBranchFilter = {
  branches: {
    only: [STAGING_BRANCH],
  },
};

// Final config
const makeConfig = () => ({
  version: 2,
  jobs: {
    Prepare: makePrepareJob(),
    // 'Www2 - unit tests': testGatsbyJob(),
    // 'App - unit tests': testMicroserviceJob({ name: 'app', testsType: 'unit' }),
    // 'Core - unit tests': testMicroserviceJob({ name: 'backend', testsType: 'unit' }),
    // 'Admin - unit tests': testMicroserviceJob({
    //   name: 'admin',
    //   testsType: 'unit',
    // }),
    // // 'Pro - unit tests': testMicroserviceJob({ name: 'pro', testsType: 'unit' }),
    'Www2 - e2e tests': testGatsbyJobE2E(),
    // 'App - e2e tests': testMicroserviceJob({ name: 'app', testsType: 'e2e' }),
    // 'Admin - e2e tests': testMicroserviceJob({
    //   name: 'admin',
    //   testsType: 'e2e',
    // }),
    // 'Pro - e2e tests': testMicroserviceJob({ name: 'pro', testsType: 'e2e' }),
    // 'Www - deploy': makeDeployJob({ name: 'www' }),
    // 'App - deploy': makeDeployJob({ name: 'app' }),
    // 'Admin - deploy': makeDeployJob({ name: 'admin' }),
    // 'Pro - deploy': makeDeployJob({ name: 'pro' }),
    // 'Backend - deploy': makeDeployJob({ name: 'backend' }),
  },
  workflows: {
    version: 2,
    'Test and deploy': {
      // jobs: ['Www2 - unit tests'],
      jobs: [
        'Prepare',
        // { 'Www2 - unit tests': { requires: ['Prepare'] } },
        // { 'App - unit tests': { requires: ['Prepare'] } },
        // { 'Core - unit tests': { requires: ['Prepare'] } },
        // { 'Admin - unit tests': { requires: ['Prepare'] } },
        // // { 'Pro - unit tests': { requires: ['Prepare'] } },
        { 'Www2 - e2e tests': { requires: ['Prepare'] } },
        // { 'App - e2e tests': { requires: ['Prepare'] } },
        // { 'Admin - e2e tests': { requires: ['Prepare'] } },
        // { 'Pro - e2e tests': { requires: ['Prepare'] } },
        // { 'App - deploy': { requires: testJobs, filters: deployBranchFilter } },
        // { 'Admin - deploy': { requires: testJobs, filters: deployBranchFilter } },
        // { 'Pro - deploy': { requires: testJobs, filters: deployBranchFilter } },
        // { 'Backend - deploy': { requires: testJobs, filters: deployBranchFilter } },
      ],
    },
  },
});

const main = () => {
  writeYAML({ file: `${__dirname}/config.yml`, data: makeConfig() });
};

main();
