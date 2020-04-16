const yargs = require('yargs');
const fs = require('fs');
const { spawnSync } = require('child_process');
const os = require('os');
const path = require('path');
const chalk = require('chalk');

const { argv } = yargs
  .string('environment')
  .alias('e', 'environment')
  .describe('environment', 'environment name')
  .demandOption('environment')
  .string('out')
  .describe('out', 'file location to store archive at');

if (!fs.existsSync('./configs/mongo-auth.json')) {
  console.error(
    chalk.redBright`Please create the './configs/mongo-auth.json' file as described in the Atlas Database User section of the docs`,
  );
  process.exit(1);
}

const { username, password } = require('./configs/mongo-auth.json');

let dbName;
if (argv.environment === 'prod') {
  dbName = 'prod';
} else if (argv.environment === 'staging') {
  dbName = 'staging';
} else {
  console.error(`Unknown environment: ${argv.environment}`);
  process.exit(1);
}

console.log(chalk.blue(`=> Pulling ${dbName} Database`));

const outPath =
  argv.out ||
  `${path.resolve(os.tmpdir(), `${Math.floor(Math.random() * 1000)}`)}.archive`;
const dbNameFile = `${outPath}.db-name.txt`;
const args = [
  '--host',
  `Cluster0-shard-0/cluster0-shard-00-00-rcyrm.gcp.mongodb.net:27017,cluster0-shard-00-01-rcyrm.gcp.mongodb.net:27017,cluster0-shard-00-02-rcyrm.gcp.mongodb.net:27017`,
  '--ssl',
  '--username',
  username,
  '--password',
  password,
  '--authenticationDatabase',
  'admin',
  '--db',
  dbName,
  // parsing of archive option is different where we have to
  // put the value with the option name
  `--archive=${outPath}`,
  '--gzip',
];

console.log(chalk.dim(`Using args: ${JSON.stringify(args, null, 2)}`));

const result = spawnSync('mongodump', args, { stdio: 'inherit' });

if (result.error instanceof Error || result.status > 0) {
  console.log(chalk.bgRed.white('Error dumping database.'));
  [
    ' - Make sure the mongo tools are installed',
    ' - Make sure your IP Address is whitelisted in Atlas, or you are using the VPN',
  ].forEach(line => console.log(chalk.yellow(line)));

  process.exit(1);
}

fs.writeFileSync(dbNameFile, dbName);

console.log(chalk.blue(`Finished pulling. File at ${outPath}`));
