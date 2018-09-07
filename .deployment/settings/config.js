import {
  CLOUDFOUNDRY_MARKETPLACE,
  CLOUDFOUNDRY_MEMORY_LIMIT,
} from '../CloudFoundry/cloudFoundryConstants';

export const ENVIRONMENT = {
  STAGING: 'staging',
  PRODUCTION: 'production',
};

export const APPLICATIONS = {
  APP: 'app',
  ADMIN: 'admin',
  WWW: 'www',
};

export const APP_CONFIGS = {
  MB512_1i: { memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB512, instances: 1 },
  MB512_2i: { memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB512, instances: 2 },
  MB1024_1i: { memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB1024, instances: 1 },
  MB1024_2i: { memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB1024, instances: 2 },
};

export const ENVIRONMENT_CONFIG = {
  [ENVIRONMENT.STAGING]: {
    serviceConfig: CLOUDFOUNDRY_MARKETPLACE.MONGO_DB.plans.small,
    [APPLICATIONS.APP]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.ADMIN]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.WWW]: { appConfig: APP_CONFIGS.MB512_1i },
  },
  [ENVIRONMENT.PRODUCTION]: {
    serviceConfig: CLOUDFOUNDRY_MARKETPLACE.MONGO_DB.plans.medium,
    [APPLICATIONS.APP]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.ADMIN]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.WWW]: { appConfig: APP_CONFIGS.MB1024_1i },
  },
};

export const SPACES = {
  [ENVIRONMENT.STAGING]: 'Staging',
  [ENVIRONMENT.PRODUCTION]: 'Production',
};

export const APP_BUILDPACK = 'https://github.com/cloudfoundry/nodejs-buildpack';
export const APP_DEPENDENCIES = {
  cfenv: '1.0.4',
  '@babel/core': '7.0.0-beta.54',
  '@babel/node': '7.0.0-beta.54',
  '@babel/preset-env': '7.0.0-beta.54',
};
export const APP_ENGINES = { node: '8.11.3' };
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
};
