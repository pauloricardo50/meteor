import { writeYAML } from '../.deployment/utils';

const WORKING_DIRECTORY = '~/app';
const CACHE_VERSION = 7;

const defaultJobValues = {
  working_directory: WORKING_DIRECTORY,
  docker: [
    {
      image: 'circleci/openjdk:10-jdk-node-browsers', // Has browsers, like chrome, necessary to run client-side tests
      environment: {
        // LANG variables are necessary for meteor to work well
        LANG: 'C.UTF-8',
        LANGUAGE: 'C.UTF-8',
        LC_ALL: 'C.UTF-8',
        LC_NUMERIC: 'en_US.UTF-8',
        METEOR_VERSION: '1.8',
        NODE_ENV: 'development', // Some packages require this during tests
        TOOL_NODE_FLAGS:
          '--max_old_space_size=8192 --optimize_for_size --gc_interval=100 --min_semi_space_size=8 --max_semi_space_size=256', // NodeJS kung-fu to make your builds run faster, without running out of memory
        METEOR_PROFILE: 1000, // If you need to debug meteor, set this to a number (in ms)
        CIRCLE_CI: 1, // Helpful in your tests, to know whether you're in circle CI or not
        DEBUG: true, // Helps
        METEOR_ALLOW_SUPERUSER: true, // Required when running meteor in docker
        // QUALIA_PROFILE_FOLDER: './profiles', // If you want to store qualia profiles
      },
    },
  ],
};

// Cache keys should have an identifier string at the start, using only _ to separate words
// and it should include the CACHE_VERSION, so all cache can be flushed at once by incrementing CACHE_VERSION
// like: "my_cache_name_${CACHE_VERSION}"
// Then follow with the variable identifiers
const cacheKeys = {
  cypress: () =>
    `cypress_${CACHE_VERSION}_{{ checksum "./package-lock.json" }}`,
  meteorSystem: name =>
    `meteor_system_${CACHE_VERSION}_${name}_{{ checksum "./microservices/${name}/.meteor/release" }}-{{ checksum "./microservices/${name}/.meteor/versions" }}`,
  meteorMicroservice: name =>
    `meteor_microservice_${CACHE_VERSION}_${name}-{{ checksum "./microservices/${name}/.meteor/release" }}-{{ checksum "./microservices/${name}/.meteor/packages" }}-{{ checksum "./microservices/${name}/.meteor/versions" }}`,
  source: () => `source_code_${CACHE_VERSION}-{{ .Branch }}-{{ .Revision }}`,
};

const cachePaths = {
  cypress: () => '~/.cache/Cypress',
  meteorSystem: () => '~/.meteor',
  meteorMicroservice: name => `./microservices/${name}/.meteor/local`,
  source: () => '.',
};

// Circle CI Commands
const runCommand = (name, command) => ({ run: { name, command } });
const restoreCache = (name, key) => ({
  restore_cache: {
    name,
    // Provide multiple, less accurate, cascading, keys for caching in case checksums fail
    // See circleCI docs: https://circleci.com/docs/2.0/caching/#restoring-cache
    keys: key
      .split('-')
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
  save_cache: { name, key, paths: [path] },
});
const storeTestResults = path => ({ store_test_results: { path } });
const storeArtifacts = path => ({ store_artifacts: { path } });

// Create preparation job with shared work
const makePrepareJob = () => ({
  ...defaultJobValues,
  steps: [
    // Update source cache with latest code
    restoreCache('Restore source', cacheKeys.source()),
    'checkout',
    restoreCache('Restore Cypress cache', cacheKeys.cypress()),
    runCommand(
      'Init submodules',
      'git submodule sync && git submodule update --init --recursive',
    ),
    runCommand('Install project node_modules', 'npm ci'),
    runCommand('Bootstrap Lerna', 'npx lerna bootstrap'),
    saveCache('Cache source', cacheKeys.source(), cachePaths.source()),
    saveCache('Cache Cypress', cacheKeys.cypress(), cachePaths.cypress()),
  ]
});

// Create test job for a given microservice
const testMicroserviceJob = name => ({
  ...defaultJobValues,
  steps: [
    restoreCache('Restore source', cacheKeys.source()),
    restoreCache('Restore meteor system', cacheKeys.meteorSystem(name)),
    restoreCache(
      'Restore meteor microservice',
      cacheKeys.meteorMicroservice(name),
    ),
    runCommand('Install meteor', './scripts/circleci/install_meteor.sh'),
    runCommand('Create results directory', 'mkdir ./results'),
    // runCommand(
    //   'Create profiles directory',
    //   `mkdir ./microservices/${name}/profiles`,
    // ),
    runCommand('Generate language files', `npm run lang ${name}`),
    runCommand(
      'Run tests',
      `cd microservices/${name} && meteor npm run test-CI`,
    ),
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
    storeTestResults('./results'),
    storeArtifacts('./results'),
    // storeArtifacts(`./microservices/${name}/profiles`),
  ],
});

// Final config
const makeConfig = () => ({
  version: 2,
  jobs: {
    Prepare: makePrepareJob(),
    'Www - unit tests': testMicroserviceJob('www'),
    'App - unit tests': testMicroserviceJob('app'),
    'Admin - unit tests': testMicroserviceJob('admin'),
  },
  workflows: {
    version: 2,
    'Build and test': {
      jobs: [
        'Prepare',
        {'Www - unit tests': {requires: ['Prepare']}},
        {'App - unit tests': {requires: ['Prepare']}},
        {'Admin - unit tests': {requires: ['Prepare']}},
      ],
    },
  },
});

const main = () => {
  writeYAML({ file: `${__dirname}/config.yml`, data: makeConfig() });
};

main();
