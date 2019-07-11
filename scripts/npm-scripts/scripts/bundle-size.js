import { MICROSERVICE_PORTS, PORT_OFFSETS } from '../constants';
import Process from './Process';

const path = require('path');

const [microservice, ...args] = process.argv.slice(2);

const port = MICROSERVICE_PORTS[microservice] + PORT_OFFSETS['bundle-size'];

const bundleSize = new Process();

bundleSize.spawn({
  command: 'meteor',
  args: [
    '--extra-packages',
    'bundle-visualizer',
    '--production',
    '--settings',
    'settings-dev.json',
    '--port',
    port,
    ...args,
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
