import CloudFoundryService from './CloudFoundry/CloudFoundryService';
import {
  SPACES,
  APP_CONFIGS,
  ENVIRONMENT,
  APPLICATIONS,
  createDeploySettingsForEnv,
} from './settings/settings';

import { formatOptionsArray, writeBash } from './utils/helpers';
import argv from 'yargs';

const formattedEnvironments = formatOptionsArray(Object.values(ENVIRONMENT));
const formattedApplications = formatOptionsArray(Object.values(APPLICATIONS));
const formattedAppConfigs = formatOptionsArray(Object.keys(APP_CONFIGS));

const createScaleApplicationScript = command =>
  writeBash({ file: 'scale.sh', data: command });

const main = () => {
  const { environment, application, config } = argv
    .usage('Usage : $0 [options]')
    .example(
      '$0 -e staging -a www -c MB1024_2i',
      `Scale 'www' on staging with MB1024_2i config`,
    )
    .alias('e', 'environment')
    .nargs('e', 1)
    .describe('e', `Environment ${formattedEnvironments}`)
    .alias('a', 'application')
    .nargs('a', 1)
    .describe('a', `Application to scale ${formattedApplications}`)
    .alias('c', 'config')
    .nargs('c', 1)
    .describe('c', `Config to use ${formattedAppConfigs}`)
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
