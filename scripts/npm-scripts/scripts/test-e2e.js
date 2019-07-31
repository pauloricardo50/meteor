import { MICROSERVICE_PORTS, PORT_OFFSETS } from '../constants';
import runBackend from './run-backend';
import Process from './Process';

const path = require('path');
const { Observable } = require('rxjs');

const [microservice, ...args] = process.argv.slice(2);

const port = MICROSERVICE_PORTS[microservice] + PORT_OFFSETS['test-e2e'];

const backend = new Process();
const cypress = new Process();
const server = new Process();

const isCI = args.includes('--ci');

runBackend(backend, '--test', ...args);

const serverSubscribtion = new Observable((observer) => {
  process.env.DDP_DEFAULT_CONNECTION_URL = 'http://localhost:5500';
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
      stdio: ['pipe', 'pipe', 'inherit'],
    },
  });

  server.stdout.on('data', (data) => {
    console.log(data.toString());
    if (data.toString().includes('App running at')) {
      observer.complete();
    }
  });

  server.process.once('exit', () => {
    if (backend.process) {
      backend.kill();
    }
  });
}).subscribe(
  () => null,
  () => null,
  () => {
    const spawnArgs = isCI
      ? [
        'run',
        '--reporter',
        'mocha-multi-reporters',
        '--reporter-options',
        'configFile=cypress/mocha-multi-reporters-config.json',
      ]
      : ['open'];

    cypress.spawn({
      command: '../../node_modules/cypress/bin/cypress',
      args: spawnArgs,
      options: {
        cwd: path.resolve(__dirname, `../../../microservices/${microservice}`),
      },
    });

    cypress.process.once('exit', (code) => {
      if (backend.process) {
        backend.kill();
      }
      if (server.process) {
        server.kill();
      }
      if (code > 0) {
        throw new Error('tests failed');
      }
    });
  },
);
