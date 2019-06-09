import { executeCommand, logError } from '../utils/helpers';
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
        logError(`Deployment failed ! Reason: ${error}`);
        throw new Error(error);
      });

  checkUserIsLoggedIn = () =>
    executeCommand(cloudFoundryCommands.getOauthToken()).catch(error => {
      logError('Please login using "cf login --sso"');
      throw new Error(error);
    });
}

export default new CloudFoundryService();
