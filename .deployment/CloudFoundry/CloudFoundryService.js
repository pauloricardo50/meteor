import { executeCommand } from '../utils/helpers';
import {
  CLOUDFOUNDRY_MARKETPLACE,
  cloudFoundryCommands,
} from './cloudFoundryConstants';

class CloudFoundryService {
  selectSpace = space => {
    return executeCommand(cloudFoundryCommands.selectSpace(space));
  };

  createMongoDBService = ({ plan, serviceInstance }) => {
    return this.checkIfServiceInstanceExists(serviceInstance).then(
      serviceExists =>
        !serviceExists &&
        executeCommand(
          cloudFoundryCommands.createService({
            plan,
            serviceInstance,
            service: CLOUDFOUNDRY_MARKETPLACE.MONGO_DB.service,
          }),
        ),
    );
  };

  checkIfServiceInstanceExists = serviceInstance => {
    return executeCommand(cloudFoundryCommands.listServices()).then(
      servicesList => servicesList.includes(serviceInstance),
    );
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
      .catch(() =>
        this.deleteFailedApp(name).then(() => {
          console.log('Smoke tests failed');
        }),
      )
      .finally(() => this.restartApp(name));
}

export default new CloudFoundryService();
