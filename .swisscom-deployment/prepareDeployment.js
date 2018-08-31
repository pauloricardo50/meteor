import {
  writeApplicationPackageJSON,
  writeApplicationManifestYAML,
  writeTmuxinatorScript,
  writeApplicationsExpectedFilesListJSON,
} from './writeFiles';

import {
  createDeploySettingsForEnv,
  APPLICATIONS,
  APP_LAUNCHER,
  APP_PACKAGE_JSON_FILE,
  APP_MANIFEST_YML_FILE,
  EXPECTED_FILES_LIST,
  TMUXINATOR_YML,
} from './settings/settings';

import { mkdir, rmDir, copyFile } from './utils/helpers';

export const getCurrentPath = () => __dirname;

// To keep track of each file that is supposed to be created
let applicationsExpectedFilesList = {};

const writeApplicationPackageFiles = ({ applications, root }) => {
  const promises = applications.map(({ name, applicationName }) => {
    const image = `${name}.tar.gz`;
    applicationsExpectedFilesList[applicationName].applicationImage = image;
    applicationsExpectedFilesList[
      applicationName
    ].packageJSON = APP_PACKAGE_JSON_FILE;
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

const writeApplicationManifestFiles = ({ applications, service, root }) => {
  const promises = applications.map(
    ({ applicationName, name, memory, instances }) => {
      applicationsExpectedFilesList[
        applicationName
      ].manifestYML = APP_MANIFEST_YML_FILE;
      return writeApplicationManifestYAML({
        applicationName: name,
        memory,
        instances,
        service: service.name,
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
  microservicePath: `${getCurrentPath()}/${microservicePath}`,
  buildDirectoryPath: `${getCurrentPath()}/${root}/${name}`,
  applicationImage: `${name}.tar.gz`,
});

const copyMeteorSettingsFile = ({ applications, meteorSettings, root }) => {
  const promises = applications.map(({ name, applicationName }) => {
    applicationsExpectedFilesList[
      applicationName
    ].meteorSettings = meteorSettings;
    return copyFile({
      sourcePath: `${getCurrentPath()}/${root}/${meteorSettings}`,
      destinationPath: `${getCurrentPath()}/${root}/${name}/${meteorSettings}`,
    });
  });

  return Promise.all(promises);
};

const copyLauncherScript = ({ applications, root }) => {
  const promises = applications.map(({ name, applicationName }) => {
    applicationsExpectedFilesList[applicationName].launcher = APP_LAUNCHER;
    return copyFile({
      sourcePath: `${getCurrentPath()}/${root}/${APP_LAUNCHER}`,
      destinationPath: `${getCurrentPath()}/${root}/${name}/${APP_LAUNCHER}`,
    });
  });

  return Promise.all(promises);
};

const writeApplicationsExpectedFilesList = ({ applications, root }) => {
  return writeApplicationsExpectedFilesListJSON({
    filePath: `${getCurrentPath()}/${root}/${EXPECTED_FILES_LIST}`,
    data: { applicationsExpectedFilesList },
  });
};

export const prepareDeployment = ({
  environment,
  applicationFilter = Object.values(APPLICATIONS),
}) => {
  const {
    service,
    root,
    meteorSettings,
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
    .then(() => writeApplicationManifestFiles({ applications, service, root }))
    .then(() => copyMeteorSettingsFile({ applications, meteorSettings, root }))
    .then(() => copyLauncherScript({ applications, root }))
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
  // .catch(error => {
  //   throw new Error(error);
  // });
};
