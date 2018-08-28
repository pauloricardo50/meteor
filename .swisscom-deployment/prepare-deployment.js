import { executeCommand } from './helpers';
import argv from 'yargs';

const buildManifestArguments = ({
  root,
  serviceName,
  application: { name, memory, instances, buildDirectory, file },
}) => {
  return ` -n ${name} -m ${memory} -i ${instances} -s ${serviceName} -f ${root}/${buildDirectory}/manifest.yml`;
};

const buildManifest = ({ root, serviceName, application }) => {
  console.log(`Building ${root}/${application.buildDirectory}/manifest.yml`);
  return executeCommand(
    `babel-node -- build-manifest.js ${buildManifestArguments({
      root,
      serviceName,
      application,
    })}`,
  );
};

const buildPackageArguments = ({
  root,
  application: { name, buildDirectory },
}) => {
  return ` -n ${name} -l launcher.js -i ${name}.tar.gz -f ${root}/${buildDirectory}/package.json`;
};

const buildPacakge = ({ root, application }) => {
  console.log(`Building ${root}/${application.buildDirectory}/package.json`);
  return executeCommand(
    `babel-node -- build-package.js ${buildPackageArguments({
      root,
      application,
    })}`,
  );
};

const copyLauncher = ({ root, application: { buildDirectory }, launcher }) => {
  console.log(`Copying ${root}/${buildDirectory}/${launcher}`);
  return executeCommand(
    `cp ${root}/${launcher} ${root}/${buildDirectory}/${launcher}`,
  );
};

const copySettings = ({ root, application: { buildDirectory }, settings }) => {
  console.log(`Copying ${root}/${buildDirectory}/${settings}`);
  return executeCommand(
    `cp ${root}/${settings} ${root}/${buildDirectory}/${settings}`,
  );
};

const prepareStaging = ({ argv: { s: deploySettings, a: filter = [] } }) => {
  const {
    staging: {
      root,
      service: { name: serviceName },
      launcher,
      settings,
      applications,
    },
  } = require(deploySettings);

  return prepare({
    root,
    serviceName,
    launcher,
    settings,
    applications,
    filter,
  }).catch(err => {
    console.log('Error:', err);
    process.exit(1);
  });
};

const prepare = ({
  root,
  serviceName,
  launcher,
  settings,
  applications,
  filter,
}) => {
  let apps =
    filter.length === 0
      ? applications
      : applications.filter(app => filter.includes(app.buildDirectory));

  return Promise.all(
    apps.map(application =>
      buildManifest({ root, serviceName, application })
        .then(() => buildPacakge({ root, application }))
        .then(() => copyLauncher({ root, launcher, application }))
        .then(() => copySettings({ root, settings, application })),
    ),
  );
};

argv
  .usage('Usage : $0 <command> [options]')
  .example(
    '$0 staging -a app www -s settings.json',
    'Prepares the staging deployment using settings.json settings for app and www',
  )
  .example(
    '$0 staging -s settings.json',
    'Prepares the staging deployment using settings.json for all microservices',
  )
  .command('staging', 'Prepares the staging deployment', prepareStaging)
  .array('a')
  .alias('a', 'applications')
  .describe('a', 'Applications to deploy')
  .alias('s', 'settings')
  .nargs('s', 1)
  .describe('s', 'Settings file')
  .demandOption(['s'])
  .help('h')
  .alias('h', 'help').argv;
