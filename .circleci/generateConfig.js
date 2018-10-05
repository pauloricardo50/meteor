import { writeYAML } from '../.deployment/utils';

const WORKING_DIRECTORY = '~/app';
const CACHE_VERSION = 4;

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
        METEOR_VERSION: '1.7',
        NODE_ENV: 'development', // Some packages require this during tests
        TOOL_NODE_FLAGS:
          '--max_old_space_size=8192 --optimize_for_size --gc_interval=100 --min_semi_space_size=8 --max_semi_space_size=256', // NodeJS kung-fu to make your builds run faster, without running out of memory
        METEOR_PROFILE: 1000, // If you need to debug meteor, turn this on
        CIRCLE_CI: 1, // Helpful in your tests, to know whether you're in circle CI or not
        DEBUG: true, // Helps
        METEOR_ALLOW_SUPERUSER: true, // Required when running meteor in docker
        // QUALIA_PROFILE_FOLDER: './profiles', // If you want to store qualia profiles
      },
    },
  ],
};

const cacheKeys = {
  meteorSystem: name =>
    `meteor-system-${name}-${CACHE_VERSION}-{{ checksum "./microservices/${name}/.meteor/versions" }}`,
  meteorMicroservice: name =>
    `meteor-microservice-${name}-${CACHE_VERSION}-{{ checksum "./microservices/${name}/.meteor/release" }}-{{ checksum "./microservices/${name}/.meteor/packages" }}-{{ checksum "./microservices/${name}/.meteor/versions" }}`,
  nodeModules: name =>
    `node_modules-${name}-${CACHE_VERSION}-{{ checksum "./microservices/${name}/package.json" }}`,
  source: () => `source-${CACHE_VERSION}-{{ .Branch }}-{{ .Revision }}`,
};

const cachePaths = {
  meteorSystem: () => '~/.meteor',
  meteorMicroservice: name => `./microservices/${name}/.meteor/local`,
  nodeModules: name => `./microservices/${name}/node_modules`,
  source: () => './.git',
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

// Create test job for a given microservice
const testMicroserviceJob = name => ({
  ...defaultJobValues,
  steps: [
    restoreCache('Restore source', cacheKeys.source()),
    'checkout',
    saveCache('Cache source', cacheKeys.source(), cachePaths.source()),
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
      'Install node_modules',
      `cd microservices/${name} && meteor npm i`,
    ),
    runCommand(
      'Install nightmare and @babel/node',
      `cd microservices/${name} && meteor npm i nightmare@2.10.0 @babel/node --no-save`, // Nightmare v3 doesn't show errors properly
    ),
    saveCache(
      'Cache node_modules',
      cacheKeys.nodeModules(name),
      cachePaths.nodeModules(name),
    ),
    runCommand(
      'Generate language files',
      `cd microservices/${name} && function npm-do { (PATH=$(npm bin):$PATH; eval $@;) } && npm-do babel-node ../../scripts/createLanguages.js ${name}`, // http://2ality.com/2016/01/locally-installed-npm-executables.html
    ),
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
    // storeArtifacts('./microservices/' + name + '/profiles'),
  ],
});

// Final config
const makeConfig = () => ({
  version: 2,
  jobs: {
    'Www - unit tests': testMicroserviceJob('www'),
    'App - unit tests': testMicroserviceJob('app'),
    'Admin - unit tests': testMicroserviceJob('admin'),
  },
  workflows: {
    version: 2,
    'Build and test': {
      jobs: ['Www - unit tests', 'App - unit tests', 'Admin - unit tests'],
    },
  },
});

const main = () => {
  writeYAML({ file: `${__dirname}/config.yml`, data: makeConfig() });
};

main();
