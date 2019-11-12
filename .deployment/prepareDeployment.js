import {
  writeApplicationPackageJSON,
  writeApplicationManifestYAML,
  writeTmuxinatorScript,
  writeApplicationsExpectedFilesListJSON,
} from './writeFiles';

import { createDeploySettingsForEnv } from './settings/settings';

import {
  APPLICATIONS,
  APP_LAUNCHER,
  APP_PACKAGE_JSON_FILE,
  APP_MANIFEST_YML_FILE,
  EXPECTED_FILES_LIST,
  TMUXINATOR_YML,
  SMOKE_TESTS_BABEL_CONF,
  SMOKE_TESTS_FOLDER,
} from './settings/config';

import { mkdir, rmDir, copyFile, getLastSegmentOfPath } from './utils/helpers';

export const getCurrentPath = () => __dirname;

// To keep track of each file that is supposed to be created
const applicationsExpectedFilesList = {};

const addFileToApplicationsExpectedFilesList = ({ applicationName, file }) =>
  (applicationsExpectedFilesList[applicationName][
    getLastSegmentOfPath(file)
  ] = getLastSegmentOfPath(file));

const writeApplicationPackageFiles = ({ applications, root }) => {
  const promises = applications.map(({ name, applicationName }) => {
    const image = `${name}.tar.gz`;
    addFileToApplicationsExpectedFilesList({ applicationName, file: image });
    addFileToApplicationsExpectedFilesList({
      applicationName,
      file: APP_PACKAGE_JSON_FILE,
    });
    return mkdir(`${getCurrentPath()}/${root}/${name}`).then(() =>
      writeApplicationPackageJSON({
        applicationName: name,
        applicationImage: image,
        filePath: `${root}/${name}/${APP_PACKAGE_JSON_FILE}`,
      }),
    );
  });

  return Promise.all(promises);
};

const writeApplicationManifestFiles = ({
  environment,
  applications,
  services,
  root,
}) => {
  const promises = applications.map(
    ({ applicationName, name, memory, instances }) => {
      addFileToApplicationsExpectedFilesList({
        applicationName,
        file: APP_MANIFEST_YML_FILE,
      });
      return writeApplicationManifestYAML({
        environment,
        name,
        applicationName,
        memory,
        instances,
        services,
        filePath: `${root}/${name}/${APP_MANIFEST_YML_FILE}`,
      });
    },
  );

  return Promise.all(promises);
};

const deleteBuildDirectories = ({ applications, root }) => {
  const promises = applications.map(({ name }) => rmDir(`${root}/${name}`));
  return Promise.all(promises);
};

const generateTmuxinatorConfigForApplication = root => ({
  applicationName,
  name,
  microservicePath,
}) => ({
  applicationName,
  name,
  microservicePath: `${getCurrentPath()}/${microservicePath}`,
  buildDirectoryPath: `${getCurrentPath()}/${root}/${name}`,
  applicationImage: `${name}.tar.gz`,
});

const copyMeteorSettingsFile = ({ applications, meteorSettings, root }) => {
  const promises = applications.map(({ name, applicationName }) => {
    addFileToApplicationsExpectedFilesList({
      applicationName,
      file: meteorSettings,
    });

    return copyFile({
      sourcePath: `${getCurrentPath()}/${root}/${meteorSettings}`,
      destinationPath: `${getCurrentPath()}/${root}/${name}/${meteorSettings}`,
    });
  });

  return Promise.all(promises);
};

const copyLauncherScript = ({ applications, root }) => {
  const promises = applications.map(({ name, applicationName }) => {
    addFileToApplicationsExpectedFilesList({
      applicationName,
      file: APP_LAUNCHER,
    });
    return copyFile({
      sourcePath: `${getCurrentPath()}/${root}/${APP_LAUNCHER}`,
      destinationPath: `${getCurrentPath()}/${root}/${name}/${APP_LAUNCHER}`,
    });
  });

  return Promise.all(promises);
};

const copySmokeTestBabelConfig = ({ applications, root }) => {
  const promises = applications.map(({ name, applicationName, smokeTests }) => {
    addFileToApplicationsExpectedFilesList({
      applicationName,
      file: SMOKE_TESTS_BABEL_CONF,
    });
    return copyFile({
      sourcePath: `${getCurrentPath()}/${SMOKE_TESTS_FOLDER}/${SMOKE_TESTS_BABEL_CONF}`,
      destinationPath: `${getCurrentPath()}/${root}/${name}/${SMOKE_TESTS_BABEL_CONF}`,
    });
  });
  return Promise.all(promises);
};

const copySmokeTestFiles = ({ applications, root }) => {
  const promises = applications.map(({ name, applicationName, smokeTests }) => {
    const appPromises = smokeTests.map(file => {
      addFileToApplicationsExpectedFilesList({
        applicationName,
        file,
      });
      return copyFile({
        sourcePath: `${getCurrentPath()}/${file}`,
        destinationPath: `${getCurrentPath()}/${root}/${name}/${getLastSegmentOfPath(
          file,
        )}`,
      });
    });
    return Promise.all(appPromises);
  });
  return Promise.all(promises).then(() =>
    copySmokeTestBabelConfig({ applications, root }),
  );
};

const writeApplicationsExpectedFilesList = ({ applications, root }) =>
  writeApplicationsExpectedFilesListJSON({
    filePath: `${getCurrentPath()}/${root}/${EXPECTED_FILES_LIST}`,
    data: { applicationsExpectedFilesList },
  });

export const prepareDeployment = ({
  environment,
  applicationFilter = Object.values(APPLICATIONS),
}) => {
  const {
    services,
    root,
    meteorSettings,
    smokeTest,
    applications: allApplications,
  } = createDeploySettingsForEnv(environment);

  const applications = allApplications.filter(({ applicationName }) =>
    applicationFilter.includes(applicationName),
  );

  applications.forEach(
    ({ applicationName }) =>
      (applicationsExpectedFilesList[applicationName] = {}),
  );

  return deleteBuildDirectories({ applications: allApplications, root })
    .then(() => writeApplicationPackageFiles({ applications, root }))
    .then(() =>
      writeApplicationManifestFiles({
        environment,
        applications,
        services,
        root,
      }),
    )
    .then(() => copyMeteorSettingsFile({ applications, meteorSettings, root }))
    .then(() => copyLauncherScript({ applications, root }))
    .then(() => copySmokeTestFiles({ applications, root }))
    .then(() => writeApplicationsExpectedFilesList({ applications, root }))
    .then(() =>
      writeTmuxinatorScript({
        tmuxinatorConfigs: applications.map(
          generateTmuxinatorConfigForApplication(root),
        ),
        filePath: `${getCurrentPath()}/${TMUXINATOR_YML}`,
        applicationsExpectedFilesList: `${getCurrentPath()}/${root}/${EXPECTED_FILES_LIST}`,
      }),
    );
};
