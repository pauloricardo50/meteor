import { writeYAML } from '../.deployment/utils';

const WORKING_DIRECTORY = '~/app';
const CACHE_VERSION = 2;

const defaultJobValues = {
  working_directory: WORKING_DIRECTORY,
  machine: true,
  environment: {
    LANG: 'C.UTF-8',
    LANGUAGE: 'C.UTF-8',
    LC_ALL: 'C.UTF-8',
    LC_NUMERIC: 'en_US.UTF-8',
    METEOR_VERSION: '1.7',
    NODE_ENV: 'development',
    TOOL_NODE_FLAGS:
      '--max_old_space_size=8192 --optimize_for_size --gc_interval=100 --min_semi_space_size=8 --max_semi_space_size=256', // if builds run out of memory
    METEOR_PROFILE: 1000, // If you need to debug meteor, turn this on
    CIRCLE_CI: 1,
    DEBUG: true,
    DOCKER_DRIVER: 'overlay2',
    // QUALIA_PROFILE_FOLDER: './profiles',
  },
};

const cacheKeys = {
  meteorSystem: name =>
    'meteor-system-' +
    name +
    '-' +
    CACHE_VERSION +
    '-{{ checksum "./.circleci/config.yml" }}',
  meteorMicroservice: name =>
    'meteor-microservice-' +
    name +
    '-' +
    CACHE_VERSION +
    '-{{ checksum "./microservices/' +
    name +
    '/.meteor/release" }}-{{ checksum "./microservices/' +
    name +
    '/.meteor/packages" }}-{{ checksum "./microservices/' +
    name +
    '/.meteor/versions" }}',
  nodeModules: name =>
    'node_modules-' +
    name +
    '-' +
    CACHE_VERSION +
    '-{{ checksum "./microservices/' +
    name +
    '/package-lock.json" }}',
};

// Circle CI Commands

const runCommand = (name, command) => ({ run: { name, command } });
const restoreCache = (name, key) => ({
  restore_cache: { name, keys: [key] },
});
const saveCache = (name, key, path) => ({
  save_cache: { name, key, paths: [path] },
});
const storeTestResults = path => ({ store_test_results: { path } });
const storeArtifacts = path => ({ store_artifacts: { path } });

// Create test job for a given microservice
const testMicroserviceJob = name => ({
  ...defaultJobValues,
  steps: [
    'checkout',
    restoreCache('Restore meteor system', cacheKeys.meteorSystem(name)),
    restoreCache(
      'Restore meteor microservice',
      cacheKeys.meteorMicroservice(name),
    ),
    restoreCache('Restore node_modules', cacheKeys.nodeModules(name)),
    runCommand('Create results directory', 'mkdir ./results'),
    // runCommand(
    //   'Create profiles directory',
    //   'mkdir ./microservices/' + name + '/profiles',
    // ),
    runCommand('Install meteor', './scripts/circleci/install_meteor.sh'),
    runCommand(
      'Copy meteor bin to build cache',
      'mkdir -p ~/build-temp && cp /usr/local/bin/meteor ~/build-temp/meteor-bin',
    ),
    runCommand(
      'Install node_modules',
      'cd microservices/' + name + ' && meteor npm i',
    ),
    saveCache(
      'Cache node_modules',
      cacheKeys.nodeModules(name),
      '.microservices/' + name + '/node_modules',
    ),
    runCommand(
      'Run tests',
      'cd microservices/' + name + ' && meteor npm run test-CI',
    ),
    saveCache('Cache meteor system', cacheKeys.meteorSystem(name), '~/.meteor'),
    saveCache(
      'Cache meteor microservice',
      cacheKeys.meteorMicroservice(name),
      './microservices/' + name + '/.meteor/local',
    ),
    storeTestResults('./results'),
    storeArtifacts('./results'),
    // storeArtifacts('./microservices/' + name + '/profiles'),
  ],
});

// Final config
const makeConfig = () => ({
  version: 2,
  jobs: {
    'test-www': testMicroserviceJob('www'),
    'test-app': testMicroserviceJob('app'),
    'test-admin': testMicroserviceJob('admin'),
  },
  workflows: {
    version: 2,
    'Build and test': {
      jobs: ['test-www', 'test-app', 'test-admin'],
    },
  },
});

const main = () => {
  writeYAML({ file: `${__dirname}/config.yml`, data: makeConfig() });
};

main();
