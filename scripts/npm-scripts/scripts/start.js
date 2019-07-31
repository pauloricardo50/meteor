import { MICROSERVICE_PORTS } from '../constants';
import runBackend from './run-backend';
import Process from './Process';

const path = require('path');
const { Observable } = require('rxjs');

const [microservice, ...args] = process.argv.slice(2);

const port = MICROSERVICE_PORTS[microservice];

const backend = new Process({ processName: 'backend' });
const prestart = new Process({ processName: 'prestart', throwOnError: true });
const start = new Process({ processName: microservice });

runBackend(backend);

const prestartSubscription = new Observable((observer) => {
  prestart.spawn({
    command: 'npm',
    args: ['run', 'lang', '--', microservice],
    options: {
      cwd: path.resolve(__dirname, '../../..'),
    },
  });

  prestart.stderr.on('data', error => prestart.throw(error));

  prestart.process.once('exit', () => {
    observer.complete();
  });
}).subscribe(
  () => null,
  () => null,
  () => {
    process.env.DDP_DEFAULT_CONNECTION_URL = 'http://localhost:5500';

    start.spawn({
      command: 'meteor',
      args: ['--settings', 'settings-dev.json', '--port', port],
      options: {
        cwd: path.resolve(__dirname, `../../../microservices/${microservice}`),
        env: {
          ...process.env,
          QUALIA_ONE_BUNDLE_TYPE: 'modern',
          METEOR_PACKAGE_DIRS: 'packages:../../meteorPackages',
        },
      },
    });

    start.process.once('exit', () => {
      if (backend.process) {
        backend.kill();
      }
    });
  },
);
