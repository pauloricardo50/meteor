import { MICROSERVICE_PORTS } from '../constants';
import runBackend from './run-backend';
import Process from './Process';

const path = require('path');
const Listr = require('listr');
const { Observable } = require('rxjs');

const [microservice, ...args] = process.argv.slice(2);

const port = MICROSERVICE_PORTS[microservice];

const backend = new Process();
const prestart = new Process();
const start = new Process();

const tasks = new Listr(
  [
    {
      title: 'Backend',
      task: () => runBackend(backend, ...args),
    },
    {
      title: 'start',
      task: () =>
        new Listr([
          {
            title: 'prestart',
            task: () =>
              new Observable((observer) => {
                prestart.spawn({
                  command: 'npm',
                  args: ['run', 'lang', '--', microservice],
                  options: {
                    cwd: path.resolve(__dirname, '../../..'),
                  },
                });
                prestart.stdout.on('data', (data) => {
                  observer.next(data.toString());
                });

                prestart.stderr.on('data', (error) => {
                  observer.error(new Error(error));
                });

                prestart.process.once('exit', () => {
                  observer.complete();
                });
              }),
          },
          {
            title: 'start',
            task: () =>
              new Observable((observer) => {
                // Set globally or it is not passed to the client
                process.env.DDP_DEFAULT_CONNECTION_URL = 'http://localhost:5500';

                start.spawn({
                  command: 'meteor',
                  args: ['--settings', 'settings-dev.json', '--port', port],
                  options: {
                    cwd: path.resolve(
                      __dirname,
                      `../../../microservices/${microservice}`,
                    ),
                    env: {
                      ...process.env,
                      QUALIA_ONE_BUNDLE_TYPE: 'modern',
                      METEOR_PACKAGE_DIRS: 'packages:../../meteorPackages',
                    },
                  },
                });

                start.stdout.on('data', (data) => {
                  observer.next(data.toString());
                  if (data.toString().includes('App running at')) {
                    observer.complete();
                  }
                });

                start.stderr.on('data', (error) => {
                  console.error(error.toString());
                });

                start.process.once('exit', () => {
                  if (backend.process) {
                    backend.kill();
                  }
                });
              }),
          },
        ]),
    },
  ],
  { concurrent: true },
);

tasks
  .run()
  .then(() => {
    backend.startLogging();
    start.startLogging();
  })
  .catch((err) => {
    const { errors = [] } = err;
    const filteredErrors = errors.filter(error => !error.toString().includes('Backend already running'));
    if (filteredErrors.length) {
      console.error(filteredErrors.map(error => error.toString()));
    }
  });
