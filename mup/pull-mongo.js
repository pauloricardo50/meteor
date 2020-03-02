const yargs = require('yargs');
const fs = require('fs');
const { spawnSync } = require('child_process');
const os = require('os');
const path = require('path');

const { argv } = yargs
  .string('environment')
  .alias('e', 'environment')
  .describe('environment', 'environment name')
  .demandOption('environment')
  .string('out')
  .describe('out', 'file location to store archive at');

if (!fs.existsSync('./configs/mongo-auth.json')) {
  console.error(
    'Please create a database user in Atlas, as described in the docs.',
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

const outPath =
  argv.out ||
  `${path.resolve(os.tmpdir(), `${Math.floor(Math.random() * 1000)}`)}.archive`;
const dbNameFile = `${outPath}.db-name.txt`;
console.log([
  '--username',
  username,
  '--password',
  password,
  '-d',
  dbName,
  '-h',
  `mongodb+srv://cluster0-rcyrm.gcp.mongodb.net`,
  `--archive`,
  outPath,
]);
spawnSync(
  'mongodump',
  [
    '--ssl',
    '--username',
    username,
    '--authenticationDatabase',
    'admin',
    '--password',
    password,
    '-d',
    dbName,
    '--host',
    `Cluster0-shard-0/cluster0-shard-00-00-rcyrm.gcp.mongodb.net:27017,cluster0-shard-00-01-rcyrm.gcp.mongodb.net:27017,cluster0-shard-00-02-rcyrm.gcp.mongodb.net:27017`,
    // parsing of archive option is different where we have to
    // put the value with the option name
    `--archive=${outPath}`,
    '--gzip',
  ],
  { stdio: 'inherit' },
);
fs.writeFileSync(dbNameFile, dbName);

console.log(`Finished pulling. File at ${outPath}`);
