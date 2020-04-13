const yargs = require('yargs');
const fs = require('fs');
const { spawnSync } = require('child_process');
const chalk = require('chalk');

const { argv } = yargs
  .string('environment')
  .alias('e', 'environment')
  .describe('environment', 'environment name')
  .demandOption('environment')
  .string('archivePath')
  .describe('archivePath', 'file location to store archive at');

if (!fs.existsSync('./configs/mongo-auth.json')) {
  console.error(
    chalk.redBright`Please create the './configs/mongo-auth.json' file as described in the Atlas Database User section of the docs`,
  );
  process.exit(1);
}

const { username, password } = require('./configs/mongo-auth.json');

let dbHost =
  'Cluster0-shard-0/cluster0-shard-00-00-rcyrm.gcp.mongodb.net:27017,cluster0-shard-00-01-rcyrm.gcp.mongodb.net:27017,cluster0-shard-00-02-rcyrm.gcp.mongodb.net:27017';
let dbName;
let additionalOptions = [
  '--username',
  username,
  '--password',
  password,
  '--ssl',
  '--authenticationDatabase',
  'admin',
];
if (argv.environment === 'staging') {
  dbName = 'staging';
} else if (argv.environment === 'local') {
  dbName = 'meteor';
  dbHost = '127.0.0.1:5501';
  additionalOptions = [];
} else {
  console.error(`Unknown environment: ${argv.environment}`);
  process.exit(1);
}

const { archivePath } = argv;
const fromName = fs.readFileSync(`${archivePath}.db-name.txt`, 'utf-8');

console.log(chalk.blue(`Restoring from ${fromName} database to ${dbName}`));

const options = [
  ...additionalOptions,
  '-h',
  dbHost,
  // Parsing for the archive option is different where we have to
  // put the value in the same array item
  `--archive=${archivePath}`,
  '--gzip',
  '--drop',
  // With one -v, it shows when droping a collection
  '-v',
  '--nsExclude',
  'admin.system.*',
  '--nsFrom',
  `"${fromName}.*"`,
  '--nsTo',
  `"${dbName}.*"`,
];

console.log(chalk.dim('Running '));
console.log(chalk.dim(`  mongorestore ${options.join(' ')}`));
console.log('');
console.log('');

const result = spawnSync('mongorestore', options, { stdio: 'inherit' });

if (result.error instanceof Error || result.status > 0) {
  console.log(chalk.bgRed.white('Error restoring database.'));
  [
    ' - Make sure the mongo tools are installed',
    ' - If restoring locally, make sure the backend app is running',
    ' - If restoring to staging, make sure your IP Address is whitelisted in Atlas or you are using the VPN',
  ].forEach(line => console.log(chalk.yellow(line)));

  process.exit(1);
}

console.log('');
console.log('Finished restore');
