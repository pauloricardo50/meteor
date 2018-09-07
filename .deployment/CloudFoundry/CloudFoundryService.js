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

  deleteOldApp = name =>
    executeCommand(cloudFoundryCommands.deleteApp(`${name}-old`)).catch(
      () => 'No old app found',
    );

  deleteFailedApp = name =>
    executeCommand(cloudFoundryCommands.deleteApp(`${name}-failed`));

  deleteOldAndFailedApps = name =>
    this.deleteOldApp(name).then(() => this.deleteFailedApp(name));

  blueGreenDeploy = ({ buildDirectory, name, manifest }) =>
    executeCommand(
      cloudFoundryCommands.blueGreenDeploy({ buildDirectory, name, manifest }),
    )
      .catch(() =>
        this.deleteFailedApp(name).then(() => {
          console.log('Smoke tests failed');
        }),
      )
      .finally(() => this.deleteOldApp(name));
}

export default new CloudFoundryService();
