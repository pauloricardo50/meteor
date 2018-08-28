import yaml from 'write-yaml';

const prepareStaging = ({ argv: { s: settings, a: filter = [] } }) => {
  const {
    staging: { root, applications },
  } = require(settings);

  prepare({ root, applications, filter });
};

const prepareProduction = ({ argv: { s: settings, a: filter = [] } }) => {
  const {
    production: { root, applications },
  } = require(settings);

  prepare({ root, applications, filter });
};

const buildPane = ({ root, buildDirectory, name }) => {
  return {
    [buildDirectory]: [
      `cd ../microservices/${buildDirectory}`,
      `meteor build ../../.swisscom-deployment/${root}/${buildDirectory}/. --server-only --architecture os.linux.x86_64`,
      `cd ../../.swisscom-deployment/${root}/${buildDirectory}`,
      `mv ./${buildDirectory}.tar.gz ./${name}.tar.gz`,
      `cf push`,
      `cd ..`,
      `rm -rf ./${buildDirectory}`,
    ],
  };
};

const buildTmuxinatorScript = panes => {
  const data = {
    name: 'deploy',
    root: './',
    on_project_exit: 'tmux kill-session deploy',
    windows: [
      {
        deploy: {
          layout: 'tiled',
          panes,
        },
      },
    ],
  };
  yaml('./deploy.yml', data, console.log);
};

const prepare = ({ root, applications, filter }) => {
  let apps =
    filter.length === 0
      ? applications
      : applications.filter(app => filter.includes(app.buildDirectory));

  const panes = apps.map(({ buildDirectory, name }) =>
    buildPane({ root, buildDirectory, name }),
  );

  buildTmuxinatorScript(panes);
};

var argv = require('yargs')
  .usage('Usage : $0 [options]')
  .example(
    '$0 staging -a app www -s settings.json',
    'Prepares the tmuxinator staging deployment script for www and app',
  )
  .command('staging', 'Prepares the staging deployment script', prepareStaging)
  .command(
    'production',
    'Prepares the production deployment script',
    prepareProduction,
  )
  .array('a')
  .alias('a', 'applications')
  .describe('a', 'Applications to deploy')
  .alias('s', 'settings')
  .describe('s', 'Settings files')
  .demandOption(['s'])
  .help('h')
  .alias('h', 'help').argv;
