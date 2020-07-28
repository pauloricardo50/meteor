import { MICROSERVICE_PORTS, PORT_OFFSETS } from '../constants';
import Process from './Process';
import runBackend from './run-backend';
import waitForServer from './waitForServer';

const path = require('path');

const [microservice, ...args] = process.argv.slice(2);

const port = MICROSERVICE_PORTS[microservice] + PORT_OFFSETS['test-e2e'];
const backendPort = MICROSERVICE_PORTS.backend + PORT_OFFSETS.test;

const backend = new Process();
const cypress = new Process();
const server = new Process();

runBackend({
  process: backend,
  args: ['--test', ...args],
});

process.env.DDP_DEFAULT_CONNECTION_URL = `http://localhost:${backendPort}`;
server.spawn({
  command: 'meteor',
  args: [
    'test',
    '--full-app',
    '--driver-package',
    'tmeasday:acceptance-test-driver',
    '--settings',
    'settings-dev.json',
    '--port',
    port,
    '--exclude-archs',
    'web.browser.legacy',
  ],
  options: {
    cwd: path.resolve(__dirname, `../../../microservices/${microservice}`),
    env: {
      ...process.env,
      METEOR_PACKAGE_DIRS: 'packages:../../meteorPackages',
    },
    stdio: 'inherit',
  },
});

waitForServer({ port, onError: () => server.kill() }, () => {
  console.log('Running cypress...');
  cypress.spawn({
    command: '../../node_modules/cypress/bin/cypress',
    args: ['open'],
    options: {
      cwd: path.resolve(__dirname, `../../../microservices/${microservice}`),
    },
  });

  cypress.process.once('exit', code => {
    if (backend.process) {
      backend.kill();
    }
    if (server.process) {
      server.kill();
    }
    process.exit(code);
  });
});
