import { MICROSERVICE_PORTS, PORT_OFFSETS } from '../constants';
import Process from './Process';
import runBackend from './run-backend';

const path = require('path');

const [microservice, ...args] = process.argv.slice(2);

const port = MICROSERVICE_PORTS[microservice] + PORT_OFFSETS.test;

const backend = new Process();
const test = new Process();

const isCI = args.includes('--ci');

runBackend(backend, ...args);

process.env.DDP_DEFAULT_CONNECTION_URL = 'http://localhost:5500';

const commonEnv = {
  ...process.env,
  METEOR_PACKAGE_DIRS: 'packages:../../meteorPackages',
};

const env = isCI
  ? {
    ...commonEnv,
    SERVER_TEST_REPORTER: 'xunit',
    // SERVER_MOCHA_OUTPUT: '~/app/results/unit-server.xml',
    // CLIENT_MOCHA_OUTPUT: '~/app/results/unit-client.xml',
    TEST_BROWSER_DRIVER: 'nightmare',
  }
  : {
    ...commonEnv,
    QUALIA_ONE_BUNDLE_TYPE: 'modern',
    TEST_WATCH: 1,
  };

const commonArgs = [
  'test',
  '--driver-package',
  'meteortesting:mocha',
  '--settings',
  'settings-dev.json',
];

const spawnArgs = isCI
  ? [...commonArgs, '--once']
  : [...commonArgs, '--port', port, ...args];

test.spawn({
  command: 'meteor',
  args: spawnArgs,
  options: {
    cwd: path.resolve(__dirname, `../../../microservices/${microservice}`),
    env,
    stdio: 'pipe',
  },
});

test.stdout.on('data', (data) => {
  console.log(data.toString());
});

test.stderr.on('data', (error) => {
  console.log(error.toString());
});

test.process.once('exit', (code) => {
  if (backend.process) {
    backend.kill();
  }
  process.exit(code);
});
