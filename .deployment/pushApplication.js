import argv from 'yargs';
import {
  readJSONFile,
  executeCommand,
  getDirectoriesList,
  isFilePresentInDirectory,
} from './utils/helpers';

import { checkApplicationsCommand } from './settings/settings';

import {
  APPLICATION_SANITY_CHECK_DONE,
  APPLICATION_SANITY_CHECK_ERROR,
  APPLICATION_SANITY_CHECK_PENDING,
} from './settings/config';

import CloudFoundryService from './CloudFoundry/CloudFoundryService';

const POLLING_INTERVAL = 500;
const POLLING_COUNTS_THROTTLING = 10;

let interval;
let pollingCounts = 0;

const displayLoadingDots = () => {
  pollingCounts += 1;
  if (pollingCounts % POLLING_COUNTS_THROTTLING === 0) {
    process.stdout.write('.');
  }
};

const pollDirectoriesSanityStatus = ({ directories = [], root }) => {
  if (directories === []) {
    clearInterval(interval);
    return Promise.resolve();
  }

  const directoriesSanityStatus = directories.map(directory =>
    isFilePresentInDirectory({
      path: `${root}/../${directory}`,
      file: APPLICATION_SANITY_CHECK_DONE,
    })
      ? APPLICATION_SANITY_CHECK_DONE
      : isFilePresentInDirectory({
          path: `${root}/../${directory}`,
          file: APPLICATION_SANITY_CHECK_ERROR,
        })
      ? APPLICATION_SANITY_CHECK_ERROR
      : APPLICATION_SANITY_CHECK_PENDING,
  );

  if (directoriesSanityStatus.includes(APPLICATION_SANITY_CHECK_ERROR)) {
    clearInterval(interval);
    throw new Error('All applications are not sane');
  }

  if (
    directoriesSanityStatus.every(
      status => status === APPLICATION_SANITY_CHECK_DONE,
    )
  ) {
    clearInterval(interval);
    return Promise.resolve();
  }

  return Promise.reject();
};

const main = () => {
  const { directory, files, application } = argv
    .usage('Usage : $0 [options]')
    .example(
      '$0 -a e-potek-app-staging -d ./staging/app -f package.json manifest.yml',
      'Push application present inside ./staging/app and check that given files are present',
    )
    .alias('a', 'application')
    .nargs('a', 1)
    .describe('a', 'Application to push')
    .alias('d', 'directory')
    .nargs('d', 1)
    .describe('d', 'Directory to push')
    .array('f')
    .alias('f', 'files')
    .describe('f', 'Files to check before pushing')
    .demandOption(['d', 'f'])
    .help('h')
    .alias('h', 'help').argv;

  executeCommand(
    checkApplicationsCommand({ directory, files, application }),
  ).then(() => {
    process.stdout.write('Polling other applications sanity status...');
    interval = setInterval(
      () =>
        pollDirectoriesSanityStatus({
          directories: getDirectoriesList(`${directory}/../`),
          root: directory,
        })
          .then(() => {
            const [manifest] = files.filter(file => file.includes('.yml'));
            CloudFoundryService.blueGreenDeploy({
              buildDirectory: directory,
              name: application,
              manifest: `${directory}/${manifest}`,
            });
          })
          .catch(displayLoadingDots),
      POLLING_INTERVAL,
    );
  });
};

main();
