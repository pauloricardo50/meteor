import { prepareDeployment } from './prepareDeployment';
import CloudFoundryService from './CloudFoundry/CloudFoundryService';
import { SPACES, ENVIRONMENT, APPLICATIONS } from './settings/settings';
import { formatOptionsArray } from './utils/helpers';
import argv from 'yargs';

const formattedEnvironments = formatOptionsArray(Object.values(ENVIRONMENT));
const formattedApplications = formatOptionsArray(Object.values(APPLICATIONS));

const main = () => {
  const { environment, applications } = argv
    .usage('Usage : $0 [options]')
    .example(
      '$0 -e staging -a app www',
      'Deploys www and app on staging server',
    )
    .alias('e', 'environment')
    .nargs('e', 1)
    .describe('e', `Environment ${formattedEnvironments}`)
    .array('a')
    .alias('a', 'applications')
    .describe('a', `Applications to deploy ${formattedApplications}`)
    .demandOption(['e'])
    .help('h')
    .alias('h', 'help').argv;

  prepareDeployment({ environment, applicationFilter: applications }).then(() =>
    CloudFoundryService.selectSpace(SPACES[environment]),
  );
};

main();
