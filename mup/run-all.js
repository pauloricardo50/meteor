const sh = require('shelljs');
const yargs = require('yargs');
const fs = require('fs');
const ejs = require('ejs');
const { spawnSync } = require('child_process');
const microservices = require('./microservices');
const { runMup, getFullCommand } = require('./utils/run-mup');

const { log, error } = console;

// Creates part of argv that should be passed to mup
// Removes the options that this script uses so mup doesn't
// get them.
function getMupCommand() {
  const commands = process.argv.slice(2);

  function removeOption(name, hasValue) {
    if (commands.includes(name)) {
      commands.splice(commands.indexOf(name), hasValue ? 2 : 1);
    }
  }
  removeOption('--environment', true);
  removeOption('-e', true);
  removeOption('--apps', true);
  removeOption('--parallel', false);

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
  .string('environment')
  .alias('e', 'environment')
  .describe('environment', 'environment name, or "all"')
  .demandOption('environment')
  .option('apps')
  .option('parallel', {
    description: 'Run command in parallel for all apps',
    type: 'boolean',
  })
  .describe('apps', 'comma separated list of app names to run the command for');

const mupCommands = getMupCommand();
// Sometimes yargs makes environment be an array with extra empty strings
const environments = getEnvironments(
  Array.isArray(argv.e) ? argv.e[0] : argv.e,
);

const wantedApps = argv.apps ? argv.apps.split(',') : null;

sh.set('-e');

if (!fs.existsSync('./configs/registry-key.json')) {
  console.error(
    'Private Repository Credentials do not exist. Please create as described in the docs.',
  );
  process.exit(1);
}

log('updating servers');
sh.exec('node update-servers');

if (mupCommands[0] === 'deploy') {
  sh.exec('meteor npm run setup');
}

function runInParallel() {
  sh.exec('bash ../scripts/installTmuxinator.sh');

  const appConfigs = [];
  environments.forEach(env => {
    const apps = filterApps(microservices[env], wantedApps);
    apps.forEach(app => {
      appConfigs.push({
        app,
        environment: env,
        configFolder: `./${env}`,
        command: getFullCommand(
          `--config ${app}.mup.js ${mupCommands.join(' ')}`,
        ),
      });
    });
  });

  const tmuxinatorConfig = ejs.render(
    fs.readFileSync('./utils/tmuxinator.yml', 'utf-8'),
    {
      apps: appConfigs,
    },
  );
  fs.writeFileSync('./tmuxinator.yml', tmuxinatorConfig);
  spawnSync('tmuxinator', ['start', 'deploy', '-p', './tmuxinator.yml'], {
    stdio: 'inherit',
    cwd: __dirname,
  });
  sh.rm('./tmuxinator.yml');
}

function runInSerial() {
  environments.forEach(environment => {
    sh.cd(environment);
    if (!(environment in microservices)) {
      error(`Unknown environment: ${environment}`);
    }

    const apps = filterApps(microservices[environment], wantedApps);

    apps.forEach(name => {
      log(`*** Running For ${name} - ${environment} ***`);
      runMup(`--config ${name}.mup.js ${mupCommands.join(' ')}`);
    });
    sh.cd('..');
  });
}

if (argv.parallel) {
  runInParallel();
} else {
  runInSerial();
}
