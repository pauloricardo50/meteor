const yargs = require('yargs');
const fs = require('fs');
const { spawnSync } = require('child_process');
const chalk = require('chalk');

const { argv } = yargs
  .string('environment')
  .alias('e', 'environment')
  .describe('environment', 'environment name')
  .demandOption('environment');

if (!fs.existsSync('./configs/mongo-auth.json')) {
  console.error(
    chalk.redBright`Please create the './configs/mongo-auth.json' file as described in the Atlas Database User section of the docs`,
  );
  process.exit(1);
}

const { username, password } = require('./configs/mongo-auth.json');

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
