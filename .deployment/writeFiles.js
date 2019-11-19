import { writeYAML, writeJSON } from './utils/helpers';
import {
  appPackageJSONData,
  appManifestYAMLData,
  tmuxinatorPane,
  tmuxinatorScript,
} from './settings/settings';

const checkWriteApplicationPackageJSONArguments = options => {
  const { applicationName, applicationImage, filePath } = options;
  if (!applicationName) {
    throw new Error('No application name provided');
  }

  if (!applicationImage) {
    throw new Error('No application image provided');
  }

  if (!filePath) {
    throw new Error('No file path provided');
  }
};

export const writeApplicationPackageJSON = options => {
  const { applicationName, applicationImage, filePath } = options;
  checkWriteApplicationPackageJSONArguments(options);
  return writeJSON({
    file: filePath,
    data: appPackageJSONData({ applicationImage, applicationName }),
  });
};

export const writeApplicationsExpectedFilesListJSON = options => {
  const { filePath, data } = options;
  return writeJSON({ file: filePath, data });
};

const checkWriteApplicationManifestYAMLArguments = options => {
  const { applicationName, memory, instances, filePath } = options;
  if (!applicationName) {
    throw new Error('No application name provided');
  }

  if (!memory) {
    throw new Error('No memory provided');
  }

  if (!instances) {
    throw new Error('No instances number provided');
  }

  if (!filePath) {
    throw new Error('No file path provided');
  }
};

export const writeApplicationManifestYAML = options => {
  const {
    environment,
    applicationName,
    name,
    memory,
    instances,
    services,
    filePath,
  } = options;

  checkWriteApplicationManifestYAMLArguments(options);

  return writeYAML({
    file: filePath,
    data: appManifestYAMLData({
      environment,
      applicationName,
      name,
      memory,
      instances,
      services,
    }),
  });
};

const checkWriteTmuxinatorScriptArguments = options => {
  const { tmuxinatorConfigs, filePath } = options;
  if (!tmuxinatorConfigs) {
    throw new Error('No applications provided');
  }
  if (!filePath) {
    throw new Error('No file path provided');
  }
  tmuxinatorConfigs.forEach(
    ({
      microservicePath,
      applicationName,
      buildDirectoryPath,
      applicationImage,
    }) => {
      if (!microservicePath) {
        throw new Error('No microservice path provided');
      }
      if (!applicationName) {
        throw new Error('No application name provided');
      }
      if (!buildDirectoryPath) {
        throw new Error('No build directory path provided');
      }
      if (!applicationImage) {
        throw new Error('No application image provided');
      }
    },
  );
};

export const writeTmuxinatorScript = options => {
  const {
    tmuxinatorConfigs,
    filePath,
    applicationsExpectedFilesList,
  } = options;
  checkWriteTmuxinatorScriptArguments(options);
  const tmuxinatorPanes = tmuxinatorConfigs.map(config =>
    tmuxinatorPane(config),
  );
  return writeYAML({
    file: filePath,
    data: tmuxinatorScript({
      panes: tmuxinatorPanes,
      applicationsExpectedFilesList,
    }),
  });
};
