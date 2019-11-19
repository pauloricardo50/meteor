import argv from 'yargs';
import CloudFoundryService from './CloudFoundry/CloudFoundryService';
import { createDeploySettingsForEnv } from './settings/settings';

import {
  SPACES,
  APP_CONFIGS,
  FORMATTED_APP_CONFIGS,
  FORMATTED_ENVIRONMENTS,
  FORMATTED_APPLICATIONS,
} from './settings/config';

import { writeBash } from './utils/helpers';

const createScaleApplicationScript = command =>
  writeBash({ file: 'scale.sh', data: command });

const main = () => {
  const { environment, application, config } = argv
    .usage('Usage : $0 [options]')
    .example(
      '$0 -e staging -a www -c MB1024_2i',
      "Scale 'www' on staging with MB1024_2i config",
    )
    .alias('e', 'environment')
    .nargs('e', 1)
    .describe('e', `Environment ${FORMATTED_ENVIRONMENTS}`)
    .alias('a', 'application')
    .nargs('a', 1)
    .describe('a', `Application to scale ${FORMATTED_APPLICATIONS}`)
    .alias('c', 'config')
    .nargs('c', 1)
    .describe('c', `Config to use ${FORMATTED_APP_CONFIGS}`)
    .demandOption(['e', 'a', 'c'])
    .help('h')
    .alias('h', 'help').argv;

  const { applications } = createDeploySettingsForEnv(environment);
  const applicationName = applications.filter(
    ({ applicationName: appName }) => appName === application,
  )[0].name;

  CloudFoundryService.getScaleApplicationCommand({
    space: SPACES[environment],
    applicationName,
    config: APP_CONFIGS[config],
  }).then(createScaleApplicationScript);
};

main();
