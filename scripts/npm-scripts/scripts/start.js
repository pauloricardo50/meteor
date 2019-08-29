import { MICROSERVICE_PORTS } from '../constants';
import runBackend from './run-backend';
import Process from './Process';

const path = require('path');

const [microservice, ...args] = process.argv.slice(2);

const port = MICROSERVICE_PORTS[microservice];
const backendPort = MICROSERVICE_PORTS.backend;

const backend = new Process();
const prestart = new Process();
const start = new Process();

runBackend(backend);

const runMicroservice = () => {
  process.env.DDP_DEFAULT_CONNECTION_URL = `http://192.168.1.69:${backendPort}`;

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
};

prestart.spawn({
  command: 'npm',
  args: ['run', 'lang', '--', microservice],
  options: {
    cwd: path.resolve(__dirname, '../../..'),
  },
});

prestart.stderr.on('data', (error) => {
  prestart.throw(error);
  process.exit(1);
});

prestart.process.once('exit', () => {
  runMicroservice();
});
