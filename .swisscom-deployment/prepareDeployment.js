import {
  writeApplicationPackageJSON,
  writeApplicationManifestYAML,
  writeTmuxinatorScript,
} from './writeFiles';

import {
  createDeploySettingsForEnv,
  APPLICATIONS,
  APP_LAUNCHER,
} from './settings/settings';

import { mkdir, rmDir, copyFile } from './utils/helpers';

export const getCurrentPath = () => {
  return __dirname;
};

const writeApplicationPackageFiles = ({ applications, root }) => {
  const promises = applications.map(({ name }) =>
    mkdir(`${getCurrentPath()}/${root}/${name}`).then(() =>
      writeApplicationPackageJSON({
        applicationName: name,
        applicationImage: `${name}.tar.gz`,
        filePath: `${root}/${name}/package.json`,
      }),
    ),
  );

  return Promise.all(promises);
};

const writeApplicationManifestFiles = ({ applications, service, root }) => {
  const promises = applications.map(({ name, memory, instances }) =>
    writeApplicationManifestYAML({
      applicationName: name,
      memory,
      instances,
      service: service.name,
      filePath: `${root}/${name}/manifest.yml`,
    }),
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
  const promises = applications.map(({ name }) =>
    copyFile({
      sourcePath: `${getCurrentPath()}/${root}/${meteorSettings}`,
      destinationPath: `${getCurrentPath()}/${root}/${name}/${meteorSettings}`,
    }),
  );

  return Promise.all(promises);
};

const copyLauncherScript = ({ applications, root }) => {
  const promises = applications.map(({ name }) =>
    copyFile({
      sourcePath: `${getCurrentPath()}/${root}/${APP_LAUNCHER}`,
      destinationPath: `${getCurrentPath()}/${root}/${name}/${APP_LAUNCHER}`,
    }),
  );

  return Promise.all(promises);
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

  return deleteBuildDirectories({ applications: allApplications, root })
    .then(() => writeApplicationPackageFiles({ applications, root }))
    .then(() => writeApplicationManifestFiles({ applications, service, root }))
    .then(() => copyMeteorSettingsFile({ applications, meteorSettings, root }))
    .then(() => copyLauncherScript({ applications, root }))
    .then(() =>
      writeTmuxinatorScript({
        tmuxinatorConfigs: applications.map(
          generateTmuxinatorConfigForApplication(root),
        ),
        filePath: './deploy.yml',
      }),
    )
    .catch(error => {
      throw new Error(error);
    });
};
