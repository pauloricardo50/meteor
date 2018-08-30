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
        serviceExists
          ? Promise.resolve()
          : executeCommand(
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
      servicesList =>
        servicesList.includes(serviceInstance)
          ? Promise.resolve(true)
          : Promise.resolve(false),
    );
  };

  getScaleApplicationCommand = ({ space, applicationName, config }) => {
    return this.selectSpace(space).then(() =>
      Promise.resolve(
        cloudFoundryCommands.scale({ appName: applicationName, ...config }),
      ),
    );
  };
}

export default new CloudFoundryService();
