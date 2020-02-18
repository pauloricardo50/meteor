const sh = require('shelljs');
const yargs = require('yargs');
const microservices = require('./microservices');

const { argv } = yargs
  .option('environment')
  .alias('e', 'environment')
  .demandOption('environment')
  .option('apps')
  .describe('apps', 'comma separated list of app names to run the command for');

let environments = [argv.environment];
if (argv.environments === 'all') {
  environments = Object.keys(microservices);
}

console.log('updating servers');
sh.exec('node update-servers');

sh.set('-e');
const commands = process.argv.slice(2);

function removeOption(name) {
  if (commands.includes(name)) {
    commands.splice(commands.indexOf(name), 2);
  }
}

removeOption('--environment');
removeOption('-e');
removeOption('--apps');

if (commands[0] === 'deploy') {
  sh.exec('meteor npm run setup');
}

process.env.FORCE_COLOR = 1;

environments.forEach(environment => {
  sh.cd(environment);
  if (!(environment in microservices)) {
    console.error(`Unknown environment: ${environment}`);
  }
  const apps = microservices[environment].filter(name => {
    if (argv.apps) {
      return argv.apps.split(',').includes(name);
    }
    return true;
  });

  apps.forEach(name => {
    console.log(`*** Running For ${name} ***`);
    sh.exec(`mup --config ${name}.mup.js ${commands.join(' ')}`);
    // process.exit();
  });
  sh.cd('..');
});
