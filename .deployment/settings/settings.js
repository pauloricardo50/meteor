import {
  ENVIRONMENT_CONFIG,
  APP_CONFIGS,
  APP_SMOKE_TEST_FILES,
  ENVIRONMENT,
  APPLICATIONS,
  SPACES,
  APP_BUILDPACK,
  APP_DEPENDENCIES,
  APP_ENGINES,
  APP_LAUNCHER,
  APP_MANIFEST_YML_FILE,
  APP_PACKAGE_JSON_FILE,
  APPLICATION_SANITY_CHECK_DONE,
  APPLICATION_SANITY_CHECK_ERROR,
  APPLICATION_SANITY_CHECK_PENDING,
  EXPECTED_FILES_LIST,
  MICROSERVICES_DIR_PATH,
  SMOKE_TESTS_BABEL_CONF,
  SMOKE_TESTS_FOLDER,
  SMOKE_TESTS_MAIN_SCRIPT,
  TMUXINATOR_SESSION_NAME,
  TMUXINATOR_YML,
} from './config.js';

import { readJSONFile, formatOptionsArray } from '../utils/helpers';

export const FORMATTED_ENVIRONMENTS = formatOptionsArray(
  Object.values(ENVIRONMENT),
);
export const FORMATTED_APPLICATIONS = formatOptionsArray(
  Object.values(APPLICATIONS),
);
export const FORMATTED_APP_CONFIGS = formatOptionsArray(
  Object.keys(APP_CONFIGS),
);

const generateSmokeTestFilesList = ({ applicationName }) =>
  APP_SMOKE_TEST_FILES[applicationName].map(
    file => `${SMOKE_TESTS_FOLDER}/${applicationName}/${file}`,
  );

const applicationSettings = ({ applicationName, environment }) => ({
  applicationName,
  name: `e-potek-${applicationName}-${environment}`, //Name on the server
  microservicePath: `${MICROSERVICES_DIR_PATH}/${applicationName}`,
  smokeTests: generateSmokeTestFilesList({ environment, applicationName }),
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
      buildpack: APP_BUILDPACK,
      services: [service],
    },
  ],
});

export const tmuxinatorPane = ({
  microservicePath,
  applicationName,
  name,
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
    `babel-node -- pushApplication.js -a ${name} -d ${buildDirectoryPath} -f ${getExpectedFilesListForApplication(
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

export const checkApplicationsCommand = ({ directory, files }) =>
  `babel-node -- checkApplicationFolderSanity.js -d ${directory} -f ${files.join(
    ' ',
  )}`;
