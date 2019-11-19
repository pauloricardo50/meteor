import argv from 'yargs';
import { getDirectoryFilesList, touchFile } from './utils/helpers';
import {
  APPLICATION_SANITY_CHECK_DONE,
  APPLICATION_SANITY_CHECK_ERROR,
} from './settings/config';

const checkIfDirectoryIncludesAllFiles = ({ directoryFiles, files }) =>
  new Promise((resolve, reject) => {
    files.forEach(file => {
      if (!directoryFiles.includes(file)) {
        reject(file);
      }
    });
    resolve();
  });

const main = () => {
  const { directory, files } = argv
    .usage('Usage : $0 [options]')
    .example(
      '$0 -d ./staging/e-potek-app-staging -f launcher.js manifest.yml package.json settings-staging.json',
      'Checks thats all provided files are present in the given directory',
    )
    .alias('d', 'directory')
    .nargs('d', 1)
    .describe('d', 'Application directory')
    .array('f')
    .alias('f', 'files')
    .describe('f', 'Files that must be present')
    .demandOption(['d', 'f'])
    .help('h')
    .alias('h', 'help').argv;

  return getDirectoryFilesList(directory)
    .then(directoryFiles =>
      checkIfDirectoryIncludesAllFiles({ directoryFiles, files }),
    )
    .then(() => touchFile(`${directory}/${APPLICATION_SANITY_CHECK_DONE}`))
    .catch(missingFile => {
      touchFile(`${directory}/${APPLICATION_SANITY_CHECK_ERROR}`);
      throw new Error(`File ${missingFile} missing from ${directory}`);
    });
};

main();
