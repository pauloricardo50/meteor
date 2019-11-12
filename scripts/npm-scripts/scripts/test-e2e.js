import { MICROSERVICE_PORTS, PORT_OFFSETS } from '../constants';
import runBackend from './run-backend';
import Process from './Process';

const path = require('path');
const http = require('http');

const [microservice, ...args] = process.argv.slice(2);

const port = MICROSERVICE_PORTS[microservice] + PORT_OFFSETS['test-e2e'];
const backendPort = MICROSERVICE_PORTS.backend + PORT_OFFSETS.test;

const backend = new Process();
const cypress = new Process();
const server = new Process();

runBackend(backend, '--test', ...args);

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

const waitServer = (retries, cb) => {
  http
    .get(`http://localhost:${port}`, res => {
      res.on('data', () => {});
      res.on('end', () => {
        cb();
      });
    })
    .on('error', e => {
      if (retries > 0) {
        setTimeout(() => waitServer(--retries, cb), 1000);
      } else {
        server.kill();
        process.exit(1);
      }
    });
};

waitServer(50, () => {
  console.log('Running cypress');
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
