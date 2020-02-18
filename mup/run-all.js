const sh = require('shelljs');
const yargs = require('yargs');
const microservices = require('./microservices');
const runMup = require('./utils/run-mup');

const { log, error } = console;

// Creates part of argv that should be passed to mup
// Removes the options that this script uses so mup doesn't
// get them.
function getMupCommand() {
  const commands = process.argv.slice(2);

  function removeOption(name) {
    if (commands.includes(name)) {
      commands.splice(commands.indexOf(name), 2);
    }
  }
  removeOption('--environment');
  removeOption('-e');
  removeOption('--apps');

  return commands;
}

function getEnvironments(name) {
  if (name === 'all') {
    return Object.keys(microservices);
  }

  return [name];
}

function filterApps(apps, wantedApps) {
  return apps.filter(name => {
    if (wantedApps) {
      return wantedApps.includes(name);
    }

    return true;
  });
}

const { argv } = yargs
  .option('environment')
  .alias('e', 'environment')
  .demandOption('environment')
  .option('apps')
  .describe('apps', 'comma separated list of app names to run the command for');

const mupCommands = getMupCommand();
const environments = getEnvironments(argv.environments);
const wantedApps = argv.apps ? argv.apps.split(',') : null;

log('updating servers');
sh.exec('node update-servers');

sh.set('-e');

if (mupCommands[0] === 'deploy') {
  sh.exec('meteor npm run setup');
}

environments.forEach(environment => {
  sh.cd(environment);
  if (!(environment in microservices)) {
    error(`Unknown environment: ${environment}`);
  }

  const apps = filterApps(microservices[environment], wantedApps);

  apps.forEach(name => {
    log(`*** Running For ${name} ***`);
    runMup(`--config ${name}.mup.js ${mupCommands.join(' ')}`);
  });
  sh.cd('..');
});
