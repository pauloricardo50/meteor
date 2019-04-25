import argv from 'yargs';

import { prepareDeployment } from './prepareDeployment';
import CloudFoundryService from './CloudFoundry/CloudFoundryService';
import {
  FORMATTED_ENVIRONMENTS,
  FORMATTED_APPLICATIONS,
} from './settings/settings';
import { SPACES } from './settings/config';

const main = () => {
  const { environment, applications } = argv
    .usage('Usage : $0 [options]')
    .example(
      '$0 -e staging -a app www',
      'Deploys www and app on staging server',
    )
    .alias('e', 'environment')
    .nargs('e', 1)
    .describe('e', `Environment ${FORMATTED_ENVIRONMENTS}`)
    .array('a')
    .alias('a', 'applications')
    .describe('a', `Applications to deploy ${FORMATTED_APPLICATIONS}`)
    .demandOption(['e'])
    .help('h')
    .alias('h', 'help').argv;

  return CloudFoundryService.checkUserIsLoggedIn()
    .then(() =>
      prepareDeployment({
        environment,
        applicationFilter: applications,
      }),
    )
    .then(() => CloudFoundryService.selectSpace(SPACES[environment]));
};

main();
