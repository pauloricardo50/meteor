import { MICROSERVICE_PORTS, PORT_OFFSETS } from '../constants';
import runBackend from './run-backend';
import Process from './Process';

const path = require('path');
const Listr = require('listr');
const { Observable } = require('rxjs');

const [microservice, ...args] = process.argv.slice(2);

const port = MICROSERVICE_PORTS[microservice] + PORT_OFFSETS['test-e2e'];

const backend = new Process();
const cypress = new Process();
const server = new Process();

const tasks = new Listr([
  {
    title: 'Backend',
    task: () => runBackend(backend, '--test'),
  },
  {
    title: 'e2e',
    task: () =>
      new Listr([
        {
          title: 'server',
          task: () =>
            new Observable((observer) => {
              // Set globally or it is not passed to the client
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
                  cwd: path.resolve(
                    __dirname,
                    `../../../microservices/${microservice}`,
                  ),
                  env: {
                    ...process.env,
                    METEOR_PACKAGE_DIRS: 'packages:../../meteorPackages',
                  },
                },
              });

              server.stdout.on('data', (data) => {
                observer.next(data.toString());
                if (data.toString().includes('App running at')) {
                  observer.complete();
                }
              });

              server.stderr.on('data', (error) => {
                console.error(error.toString());
              });

              server.process.once('exit', () => {
                if (backend.process) {
                  backend.kill();
                }
              });
            }),
        },
        {
          title: 'cypress',
          task: () =>
            new Observable((observer) => {
              const isCI = args.includes('--ci');

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
                  cwd: path.resolve(
                    __dirname,
                    `../../../microservices/${microservice}`,
                  ),
                },
              });

              cypress.stdout.on('data', (data) => {
                observer.next(data.toString());
                if (data.toString().includes('Cypress Config')) {
                  observer.complete();
                }
              });

              cypress.stderr.on('data', (error) => {
                console.error(error.toString());
              });

              cypress.process.once('exit', () => {
                if (backend.process) {
                  backend.kill();
                }
                if (server.process) {
                  server.kill();
                }
              });
            }),
        },
      ]),
  },
]);

tasks
  .run()
  .then(() => {
    backend.startLogging();
    cypress.startLogging();
  })
  .catch((err) => {
    const { errors = [] } = err;
    const filteredErrors = errors.filter(error => !error.toString().includes('Backend already running'));
    if (filteredErrors.length) {
      console.error(filteredErrors.map(error => error.toString()));
    }
  });
