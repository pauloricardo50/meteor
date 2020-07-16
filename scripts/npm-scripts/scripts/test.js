import { MICROSERVICE_PORTS, PORT_OFFSETS } from '../constants';
import Process from './Process';

const path = require('path');

const [microservice, ...args] = process.argv.slice(2);

const port = MICROSERVICE_PORTS[microservice] + PORT_OFFSETS.test;

const backend = new Process();
const test = new Process();

const env = {
  ...process.env,
  NODE_ICU_DATA: `${__dirname}/../../../microservices/${microservice}/node_modules/full-icu`, // FIXME: This prevents tests from starting
  METEOR_PACKAGE_DIRS: 'packages:../../meteorPackages',
  QUALIA_ONE_BUNDLE_TYPE: 'modern',
  TEST_WATCH: 1,
  BABEL_ENV: 'test',
  RTL_SKIP_AUTO_CLEANUP: 1, // We do this in our tests
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
  '--exclude-archs',
  'web.browser.legacy',
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
