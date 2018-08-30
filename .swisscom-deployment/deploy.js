import { prepareDeployment } from './prepareDeployment';
import CloudFoundryService from './CloudFoundry/CloudFoundryService';
import { SPACES } from './settings/settings';
import argv from 'yargs';

const main = () => {
  const { environment, applications } = argv
    .usage('Usage : $0 <command> [options]')
    .example(
      '$0 -e staging -a app www',
      'Deploys www and app on staging server',
    )
    .alias('e', 'environment')
    .nargs('e', 1)
    .describe('e', `Environment ['staging', 'production']`)
    .array('a')
    .alias('a', 'applications')
    .describe('a', 'Applications to deploy')
    .demandOption(['e'])
    .help('h')
    .alias('h', 'help').argv;

  prepareDeployment({ environment, applicationFilter: applications }).then(() =>
    CloudFoundryService.selectSpace(SPACES[environment]),
  );
};

main();
