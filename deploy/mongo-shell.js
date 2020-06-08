const yargs = require('yargs');
const { spawnSync } = require('child_process');
const { retrieveSecret } = require('./utils/secrets');

const { argv } = yargs
  .string('environment')
  .alias('e', 'environment')
  .describe('environment', 'environment name')
  .demandOption('environment');

const { username, password } = retrieveSecret('mongo-user');

let dbName;
if (argv.environment === 'production') {
  dbName = 'prod';
} else if (argv.environment === 'staging') {
  dbName = 'staging';
} else {
  console.error(`Unknown environment: ${argv.environment}`);
  process.exit(1);
}

spawnSync(
  'mongo',
  [
    '--username',
    username,
    '--password',
    password,
    `mongodb+srv://cluster0-rcyrm.gcp.mongodb.net/${dbName}`,
  ],
  { stdio: 'inherit' },
);
