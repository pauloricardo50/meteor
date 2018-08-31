import {
  CLOUDFOUNDRY_MARKETPLACE,
  CLOUDFOUNDRY_MEMORY_LIMIT,
} from '../CloudFoundry/cloudFoundryConstants';

import { readJSONFile, formatOptionsArray } from '../utils/helpers';

export const ENVIRONMENT = {
  STAGING: 'staging',
  PRODUCTION: 'production',
};

export const SPACES = {
  [ENVIRONMENT.STAGING]: 'Staging',
  [ENVIRONMENT.PRODUCTION]: 'Production',
};

export const APPLICATIONS = {
  APP: 'app',
  ADMIN: 'admin',
  WWW: 'www',
};

const MICROSERVICES_DIR_PATH = '../microservices';
const APP_ENGINES = { node: '8.11.3' };
const APP_DEPENDENCIES = { cfenv: '1.0.4' };
const TMUXINATOR_SESSION_NAME = 'deploy';
export const APP_LAUNCHER = 'launcher.js';
export const APP_PACKAGE_JSON_FILE = 'package.json';
export const APP_MANIFEST_YML_FILE = 'manifest.yml';
export const EXPECTED_FILES_LIST = 'applicationsExpectedFilesList.json';
export const TMUXINATOR_YML = 'deploy.yml';
export const APPLICATION_SANITY_CHECK_DONE = 'done';
export const APPLICATION_SANITY_CHECK_ERROR = 'error';
export const APPLICATION_SANITY_CHECK_PENDING = 'pending';

export const APP_CONFIGS = {
  MB512_1i: { memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB512, instances: 1 },
  MB512_2i: { memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB512, instances: 2 },
  MB1024_1i: { memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB1024, instances: 1 },
  MB1024_2i: { memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB1024, instances: 2 },
};

export const FORMATTED_ENVIRONMENTS = formatOptionsArray(
  Object.values(ENVIRONMENT),
);
export const FORMATTED_APPLICATIONS = formatOptionsArray(
  Object.values(APPLICATIONS),
);
export const FORMATTED_APP_CONFIGS = formatOptionsArray(
  Object.keys(APP_CONFIGS),
);

const ENVIRONMENT_CONFIG = {
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

const applicationSettings = ({ applicationName, environment }) => ({
  applicationName,
  name: `e-potek-${applicationName}-${environment}`, //Name on the server
  microservicePath: `${MICROSERVICES_DIR_PATH}/${applicationName}`,
  ...ENVIRONMENT_CONFIG[environment][applicationName].appConfig,
});

export const createDeploySettingsForEnv = environment => ({
  service: {
    name: `mongo-${environment}`,
    size: ENVIRONMENT_CONFIG[environment].serviceConfig,
  },
  root: `./${environment}`,
  meteorSettings: `settings-${environment}.json`,
  applications: Object.values(APPLICATIONS).map(applicationName =>
    applicationSettings({ applicationName, environment }),
  ),
});

const appScripts = applicationImage => ({
  start: `node ${APP_LAUNCHER}`,
  postinstall: `tar -xf ${applicationImage} && (cd bundle/programs/server && npm install)`,
});

export const appPackageJSONData = ({ applicationName, applicationImage }) => ({
  name: applicationName,
  private: true,
  scripts: appScripts(applicationImage),
  engines: APP_ENGINES,
  dependencies: APP_DEPENDENCIES,
});

export const appManifestYAMLData = ({
  applicationName,
  memory,
  instances,
  service,
}) => ({
  applications: [
    {
      name: applicationName,
      memory,
      instances,
      services: [service],
    },
  ],
});

export const tmuxinatorPane = ({
  microservicePath,
  applicationName,
  buildDirectoryPath,
  applicationImage,
  applicationsToCheck,
}) => ({
  [applicationName]: [
    `cd ${microservicePath}`,
    `meteor build ${buildDirectoryPath}/. --server-only --architecture os.linux.x86_64`,
    `cd ${buildDirectoryPath}`,
    `mv ./*.tar.gz ./${applicationImage}`,
    `cd ../../`,
    `babel-node -- pushApplication.js -d ${buildDirectoryPath} -f ${getExpectedFilesListForApplication(
      { applicationName, buildDirectoryPath },
    )}`,
    `cd ..`,
    `rm -rf ${buildDirectoryPath}`,
  ],
});

export const tmuxinatorScript = ({ panes, applicationsExpectedFilesList }) => ({
  name: TMUXINATOR_SESSION_NAME,
  root: './',
  on_project_exit: `rm ${applicationsExpectedFilesList} && tmux kill-session -t ${TMUXINATOR_SESSION_NAME}`,
  windows: [{ deploy: { layout: 'tiled', panes } }],
});

const getExpectedFilesListForApplication = ({
  applicationName,
  buildDirectoryPath,
}) => {
  const { applicationsExpectedFilesList } = readJSONFile(
    `${buildDirectoryPath}/../${EXPECTED_FILES_LIST}`,
  );
  return Object.values(applicationsExpectedFilesList[applicationName]).join(
    ' ',
  );
};
