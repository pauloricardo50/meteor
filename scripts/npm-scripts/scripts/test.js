import { MICROSERVICE_PORTS, PORT_OFFSETS } from '../constants';
import Process from './Process';
import runBackend from './run-backend';

const path = require('path');

const [microservice, ...args] = process.argv.slice(2);

const port = MICROSERVICE_PORTS[microservice] + PORT_OFFSETS.test;
const backendPort = MICROSERVICE_PORTS.backend + PORT_OFFSETS.test;

const backend = new Process();
const test = new Process();

runBackend(backend, '--test', ...args);

process.env.DDP_DEFAULT_CONNECTION_URL = `http://localhost:${backendPort}`;

const env = {
  ...process.env,
  METEOR_PACKAGE_DIRS: 'packages:../../meteorPackages',
  QUALIA_ONE_BUNDLE_TYPE: 'modern',
  TEST_WATCH: 1,
  // TEST_SERVER: 0, // If you only want client tests
};

const spawnArgs = [
  'test',
  '--driver-package',
  'meteortesting:mocha',
  '--settings',
  'settings-dev.json',
  '--port',
  port,
  ...args,
];

test.spawn({
  command: 'meteor',
  args: spawnArgs,
  options: {
    cwd: path.resolve(__dirname, `../../../microservices/${microservice}`),
    env,
    stdio: 'inherit',
  },
});

test.process.once('exit', code => {
  if (backend.process) {
    backend.kill();
  }
  process.exit(code);
});
