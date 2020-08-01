const sh = require('shelljs');
const yargs = require('yargs');
const fs = require('fs');
const ejs = require('ejs');
const { spawnSync } = require('child_process');
const chalk = require('chalk');
const microservices = require('./utils/microservices');
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

function filterApps(apps, wantedApps, isDeploying) {
  if (wantedApps) {
    wantedApps.forEach(app => {
      if (!apps.includes(app)) {
        throw new Error(`Unknown wanted app: ${app}`)
      } 
    })
  }

  return apps.filter(name => {
    if (isDeploying && name === 'api') {
      // api is handled by a hook in the backend
      return false;
    }

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
const isDeploying = mupCommands.includes('deploy');

sh.set('-e');

sh.exec('node update-servers');

if (mupCommands[0] === 'deploy') {
  sh.exec('bash ../scripts/setup-root.sh');
}

function runInParallel() {
  try {
    sh.exec('gem list - i tmuxinator');
  } catch (e) {
    try {
      sh.exec('tmuxinator -v');
    } catch (_e) {
      console.error(_e);
      console.error(chalk.red('Please install tmuxinator'));
      process.exit(1);
    }
  }

  const appConfigs = [];
  environments.forEach(env => {
    const apps = filterApps(microservices[env], wantedApps, isDeploying);
    apps.forEach(app => {
      appConfigs.push({
        app,
        environment: env,
        configFolder: `./${env}`,
        command: getFullCommand(
          `--config ${app}.mup.js ${mupCommands.join(' ')}`,
        ),
        runSetup: isDeploying,

        // If it starts with an option, we just show everything
        // instead of trying to identify what is the command or what is a value to an option
        prettyCommand: mupCommands[0].startsWith('-')
          ? mupCommands.join(' ')
          : mupCommands[0],
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
    if (!(environment in microservices)) {
      error(chalk.red(`Unknown environment: ${environment}`));
      process.exit(1);
    }

    sh.cd(environment);

    const apps = filterApps(
      microservices[environment],
      wantedApps,
      isDeploying,
    );

    apps.forEach(name => {
      log('');
      log(
        chalk.underline.blueBright(
          `*** Running for ${name} - ${environment} ***`.toUpperCase(),
        ),
      );
      if (isDeploying) {
        sh.cd(__dirname + '/../scripts')
        sh.exec(`bash setup-microservice.sh ${name}`)
        sh.cd(__dirname + '/' + environment)
      }

      runMup(`--config ${name}.mup.js ${mupCommands.join(' ')}`);
    });
    sh.cd('..');
  });
}

const singleApp = wantedApps && wantedApps.length === 1

if (argv.parallel || (isDeploying && !singleApp)) {
  runInParallel();
} else {
  runInSerial();
}
