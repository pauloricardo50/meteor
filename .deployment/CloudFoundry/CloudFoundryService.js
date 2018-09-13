import { executeCommand } from '../utils/helpers';
import {
  CLOUDFOUNDRY_MARKETPLACE,
  cloudFoundryCommands,
} from './cloudFoundryConstants';

class CloudFoundryService {
  selectSpace = space => {
    return executeCommand(cloudFoundryCommands.selectSpace(space));
  };

  getScaleApplicationCommand = ({ space, applicationName, config }) => {
    return this.selectSpace(space).then(() =>
      cloudFoundryCommands.scale({ appName: applicationName, ...config }),
    );
  };

  pushApplication = buildDirectory =>
    executeCommand(cloudFoundryCommands.push(buildDirectory));

  pushApplicationZeroDownTime = ({ directory, manifest, name }) =>
    executeCommand(
      cloudFoundryCommands.zeroDownTimePush({ directory, manifest, name }),
    );

  deleteFailedApp = name =>
    executeCommand(cloudFoundryCommands.deleteApp(`${name}-failed`));

  restartApp = name => executeCommand(cloudFoundryCommands.restartApp(name));

  blueGreenDeploy = ({ buildDirectory, name, manifest }) =>
    executeCommand(
      cloudFoundryCommands.blueGreenDeploy({ buildDirectory, name, manifest }),
    )
      .then(() => this.restartApp(name))
      .catch(error => {
        //Logs the error in red
        console.error(
          '\x1b[31m%s\x1b[0m',
          `Deployment failed ! Reason: ${error}`,
        );
        throw new Error(error);
      });
}

export default new CloudFoundryService();
