import {
  CLOUDFOUNDRY_MEMORY_LIMIT,
  CLOUDFOUNDRY_DISK_LIMIT,
} from '../CloudFoundry/cloudFoundryConstants';

export const ENVIRONMENT = {
  STAGING: 'staging',
  PRODUCTION: 'production',
  DEV: 'dev',
};

export const APPLICATIONS = {
  ADMIN: 'admin',
  APP: 'app',
  PRO: 'pro',
  WWW: 'www',
  BACKEND: 'backend',
};

export const SERVICES = {
  MONGODB: 'mongo',
  REDIS: 'redis',
  LOGS: 'logs',
};

export const APP_CONFIGS = {
  MB64_1i: {
    memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB64,
    instances: 1,
    disk_quota: CLOUDFOUNDRY_DISK_LIMIT.GB2,
  },
  MB256_1i: {
    memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB256,
    instances: 1,
    disk_quota: CLOUDFOUNDRY_DISK_LIMIT.GB2,
  },
  MB512_1i: {
    memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB512,
    instances: 1,
    disk_quota: CLOUDFOUNDRY_DISK_LIMIT.GB2,
  },
  MB512_2i: {
    memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB512,
    instances: 2,
    disk_quota: CLOUDFOUNDRY_DISK_LIMIT.GB2,
  },
  MB1024_1i: {
    memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB1024,
    instances: 1,
    disk_quota: CLOUDFOUNDRY_DISK_LIMIT.GB2,
  },
  MB1024_2i: {
    memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB1024,
    instances: 2,
    disk_quota: CLOUDFOUNDRY_DISK_LIMIT.GB2,
  },
  MB1536_2i: {
    memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB1536,
    instances: 2,
    disk_quota: CLOUDFOUNDRY_DISK_LIMIT.GB2,
  },
  MB2048_1i: {
    memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB2048,
    instances: 1,
    disk_quota: CLOUDFOUNDRY_DISK_LIMIT.GB2,
  },
  MB2048_2i: {
    memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB2048,
    instances: 2,
    disk_quota: CLOUDFOUNDRY_DISK_LIMIT.GB2,
  },
};

export const ENVIRONMENT_CONFIG = {
  [ENVIRONMENT.STAGING]: {
    services: [SERVICES.MONGODB, SERVICES.REDIS, SERVICES.LOGS],
    [APPLICATIONS.APP]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.ADMIN]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.WWW]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.PRO]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.BACKEND]: { appConfig: APP_CONFIGS.MB1024_1i },
  },
  [ENVIRONMENT.PRODUCTION]: {
    services: [SERVICES.MONGODB, SERVICES.REDIS, SERVICES.LOGS],
    [APPLICATIONS.APP]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.ADMIN]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.WWW]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.PRO]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.BACKEND]: { appConfig: APP_CONFIGS.MB2048_2i },
  },
  [ENVIRONMENT.DEV]: {
    services: [SERVICES.MONGODB],
    [APPLICATIONS.APP]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.ADMIN]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.WWW]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.PRO]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.BACKEND]: { appConfig: APP_CONFIGS.MB512_1i },
  },
};

export const SPACES = {
  [ENVIRONMENT.STAGING]: 'Staging',
  [ENVIRONMENT.PRODUCTION]: 'Production',
  [ENVIRONMENT.DEV]: 'Dev',
};

export const APP_BUILDPACK = 'https://github.com/cloudfoundry/nodejs-buildpack';
export const APP_DEPENDENCIES = {
  cfenv: '1.0.4',
  '@babel/core': '7.1.2',
  '@babel/node': '7.0.0',
  '@babel/preset-env': '7.1.0',
};
export const APP_ENGINES = { node: '12.14.0' };
export const APP_LAUNCHER = 'launcher.js';
export const APP_MANIFEST_YML_FILE = 'manifest.yml';
export const APP_PACKAGE_JSON_FILE = 'package.json';
export const APPLICATION_SANITY_CHECK_DONE = 'done';
export const APPLICATION_SANITY_CHECK_ERROR = 'error';
export const APPLICATION_SANITY_CHECK_PENDING = 'pending';
export const EXPECTED_FILES_LIST = 'applicationsExpectedFilesList.json';
export const MICROSERVICES_DIR_PATH = '../microservices';
export const SMOKE_TESTS_BABEL_CONF = 'babel.config.js';
export const SMOKE_TESTS_FOLDER = './smokeTests';
export const SMOKE_TESTS_MAIN_SCRIPT = 'test.sh';
export const TMUXINATOR_SESSION_NAME = 'deploy';
export const TMUXINATOR_YML = 'deploy.yml';

export const APP_SMOKE_TEST_FILES = {
  [APPLICATIONS.APP]: [SMOKE_TESTS_MAIN_SCRIPT, 'test.js'],
  [APPLICATIONS.ADMIN]: [SMOKE_TESTS_MAIN_SCRIPT, 'test.js'],
  [APPLICATIONS.WWW]: [SMOKE_TESTS_MAIN_SCRIPT, 'test.js'],
  [APPLICATIONS.PRO]: [SMOKE_TESTS_MAIN_SCRIPT, 'test.js'],
  [APPLICATIONS.BACKEND]: [SMOKE_TESTS_MAIN_SCRIPT, 'test.js'],
};

export const APP_ENV_VARIABLES = {
  [ENVIRONMENT.STAGING]: {
    [APPLICATIONS.WWW]: { DISABLE_WEBSOCKETS: 1 },
  },
  [ENVIRONMENT.PRODUCTION]: {
    [APPLICATIONS.WWW]: { DISABLE_WEBSOCKETS: 1 },
  },
  [ENVIRONMENT.DEV]: {
    [APPLICATIONS.WWW]: { DISABLE_WEBSOCKETS: 1 },
  },
};
