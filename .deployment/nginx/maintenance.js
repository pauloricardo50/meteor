import argv from 'yargs';
import {
  FORMATTED_ENVIRONMENTS,
  FORMATTED_APPLICATIONS,
} from '../settings/settings';
import { ENVIRONMENT, APPLICATIONS } from '../settings/config';
import { writeNginxManifest } from './writeNginxManifest';

const startMaintenance = ({ environment, applications }) => {
  applications &&
    applications.forEach(application => {
      if (!Object.values(APPLICATIONS).includes(application)) {
        throw new Error(
          `Unknown application ${application}. Please provide a valid application: ${FORMATTED_APPLICATIONS}`,
        );
      }
    });

  const applicationsFiltered = applications
    ? Object.values(APPLICATIONS).filter(application =>
        applications.includes(application),
      )
    : Object.values(APPLICATIONS);

  if (!Object.values(ENVIRONMENT).includes(environment)) {
    throw new Error(
      `Unknown environment ${environment}. Please provide a valid environment: ${FORMATTED_ENVIRONMENTS}`,
    );
  }

  writeNginxManifest({
    maintenanceEnvironment: environment,
    maintenanceApplications: applicationsFiltered,
  });
};
const stopMaintenance = () => writeNginxManifest({});

const main = () => {
  const { environment, applications } = argv
    .usage('Usage : $0 <command> [options]')
    .command('start', 'Starts maintenance', () => null, startMaintenance)
    .command('stop', 'Stops the maintenance', () => null, stopMaintenance)
    .example(
      '$0 start -e staging -a app www',
      `Start maintenance for app and www in staging environment`,
    )
    .alias('e', 'environment')
    .nargs('e', 1)
    .describe('e', `Environment ${FORMATTED_ENVIRONMENTS}`)
    .alias('a', 'applications')
    .array('a')
    .describe('a', `Applications ${FORMATTED_APPLICATIONS}`)
    .demandCommand(1)
    .help('h')
    .alias('h', 'help').argv;
};

main();
