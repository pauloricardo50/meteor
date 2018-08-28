import argv from 'yargs';
import { executeCommand } from './helpers';

const createMongoService = ({ service }) => {
  return executeCommand('cf services').then(
    services =>
      services.includes(service.name)
        ? Promise.resolve()
        : executeCommand(
            `cf create-service mongodb-2 ${service.size} ${service.name}`,
          ),
  );
};

const deployStaging = ({ argv: { a: apps = [], s: deploySettings = '' } }) => {
  if (!deploySettings) {
    deploySettings = './deploy-settings.json';
  }

  const {
    staging: { service },
  } = require(deploySettings);

  return executeCommand('cf target -s Staging')
    .then(() => createMongoService({ service }))
    .then(() =>
      executeCommand(
        `babel-node -- prepare-deployment.js staging -s ./deploy-settings.json -a ${getApps(
          apps,
        )}`,
      ),
    )
    .then(() =>
      executeCommand(
        `babel-node -- prepare-tmuxinator.js staging -s ./deploy-settings.json -a ${getApps(
          apps,
        )}`,
      ),
    )
    .catch(err => {
      console.log('Error : ', err);
      process.exit(1);
    });
};

const deployProduction = ({
  argv: { a: apps = [], s: deploySettings = '' },
}) => {
  if (!deploySettings) {
    deploySettings = './deploy-settings.json';
  }

  const {
    production: { service },
  } = require(deploySettings);

  return executeCommand('cf target -s Production')
    .then(() => createMongoService({ service }))
    .then(() =>
      executeCommand(
        `babel-node -- prepare-deployment.js production -s ./deploy-settings.json -a ${getApps(
          apps,
        )}`,
      ),
    )
    .then(() =>
      executeCommand(
        `babel-node -- prepare-tmuxinator.js production -s ./deploy-settings.json -a ${getApps(
          apps,
        )}`,
      ),
    )
    .catch(err => {
      console.log('Error : ', err);
      process.exit(1);
    });
};

const getApps = apps => apps.reduce((apps, app) => `${apps} ${app}`, '');

argv
  .usage('Usage : $0 <command> [options]')
  .example('$0 staging -a app www', 'Deploys www and app on staging server')
  .command('staging', 'Deploys apps on staging', deployStaging)
  .command('production', 'Deploys apps on production', deployProduction)
  .array('a')
  .alias('a', 'applications')
  .describe('a', 'Applications to deploy')
  .alias('s', 'settings')
  .nargs('s', 1)
  .describe('s', 'Settings file')
  .help('h')
  .alias('h', 'help').argv;
