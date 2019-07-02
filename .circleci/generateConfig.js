import { writeYAML } from '../.deployment/utils';

const WORKING_DIRECTORY = '~/app';
const CACHE_VERSION = 14;

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
        METEOR_VERSION: '1.8.1',
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
// Then follow with the variable identifiers, each separated by a hyphen "-"
const cacheKeys = {
  global: () => `global_${CACHE_VERSION}-{{ .Branch }}-{{ .Revision }}`,
  meteorSystem: name =>
    `meteor_system_${CACHE_VERSION}_${name}_{{ checksum "./microservices/${name}/.meteor/release" }}-{{ checksum "./microservices/${name}/.meteor/versions" }}`,
  meteorMicroservice: name =>
    `meteor_microservice_${CACHE_VERSION}_${name}-{{ .Branch }}-{{ .Revision }}`,
  nodeModules: () =>
    `node_modules_${CACHE_VERSION}-{{ checksum "./package-lock.json" }}`,
  source: () => `source_${CACHE_VERSION}-{{ .Branch }}-{{ .Revision }}`,
};

const cachePaths = {
  global: () => '~/.cache',
  meteorSystem: () => '~/.meteor',
  meteorMicroservice: name => [
    `./microservices/${name}/.meteor/local/bundler-cache`,
    `./microservices/${name}/.meteor/local/isopacks`,
    `./microservices/${name}/.meteor/local/plugin-cache`,
  ],
  nodeModules: () => './node_modules',
  source: () => '.',
};

// Circle CI Commands
const runCommand = (name, command) => ({ run: { name, command } });
const runTestsCommand = (name, testsType) => {
  switch (testsType) {
    case 'e2e':
      return runCommand(
        'Run e2e tests',
        `meteor npm --prefix microservices/${name} run test-e2e-CI`,
      );
    case 'unit':
      return runCommand(
        'Run unit tests',
        `meteor npm --prefix microservices/${name} run test-CI`,
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
          parts.slice(0, parts.length - index).join('-')
            + (index === 0 ? '' : '-'),
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
const testMicroserviceJob = (name, testsType) => ({
  ...defaultJobValues,
  steps: [
    restoreCache('Restore source', cacheKeys.source()),
    restoreCache('Restore global cache', cacheKeys.global()),
    restoreCache('Restore node_modules', cacheKeys.nodeModules()),
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
    runCommand(
      'Install node_modules',
      `meteor npm --prefix microservices/${name} ci`,
    ),
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
    storeTestResults(testsType === 'e2e' ? './e2e-results' : './results'),
    storeArtifacts(testsType === 'e2e' ? './e2e-results' : './results'),
    // storeArtifacts(`./microservices/${name}/profiles`),
  ],
});

// Final config
const makeConfig = () => ({
  version: 2,
  jobs: {
    Prepare: makePrepareJob(),
    'Www - unit tests': testMicroserviceJob('www', 'unit'),
    'App - unit tests': testMicroserviceJob('app', 'unit'),
    'Admin - unit tests': testMicroserviceJob('admin', 'unit'),
    'Pro - unit tests': testMicroserviceJob('pro', 'unit'),
    'Www - e2e tests': testMicroserviceJob('www', 'e2e'),
    'App - e2e tests': testMicroserviceJob('app', 'e2e'),
    'Admin - e2e tests': testMicroserviceJob('admin', 'e2e'),
    'Pro - e2e tests': testMicroserviceJob('pro', 'e2e'),
  },
  workflows: {
    version: 2,
    'Build and test': {
      jobs: [
        'Prepare',
        { 'Www - unit tests': { requires: ['Prepare'] } },
        { 'App - unit tests': { requires: ['Prepare'] } },
        { 'Admin - unit tests': { requires: ['Prepare'] } },
        { 'Pro - unit tests': { requires: ['Prepare'] } },
        { 'Www - e2e tests': { requires: ['Www - unit tests'] } },
        { 'App - e2e tests': { requires: ['App - unit tests'] } },
        { 'Admin - e2e tests': { requires: ['Admin - unit tests'] } },
        { 'Pro - e2e tests': { requires: ['Pro - unit tests'] } },
      ],
    },
  },
});

const main = () => {
  writeYAML({ file: `${__dirname}/config.yml`, data: makeConfig() });
};

main();
