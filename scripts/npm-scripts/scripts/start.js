import fs from 'fs';
import { resolve } from 'path';
import sh from 'shelljs';

import { MICROSERVICE_PORTS } from '../constants';
import Process from './Process';
import runBackend from './run-backend';

const path = require('path');

const [microservice, ...args] = process.argv.slice(2);

const port = MICROSERVICE_PORTS[microservice];
const backendPort = MICROSERVICE_PORTS.backend;

const backend = new Process();
const prestart = new Process();
const start = new Process();

runBackend({ process: backend });

const runMicroservice = () => {
  process.env.DDP_DEFAULT_CONNECTION_URL = `http://localhost:${backendPort}`;

  let command = 'meteor';
  let additionalArgs = [];

  if (process.env.HMR_ENABLED) {
    console.log('');
    console.log('=> Setting up HMR');
    const checkoutPath = resolve(__dirname, 'meteor-checkout');

    try {
      fs.mkdirSync(checkoutPath);
      sh.exec(`git clone https://github.com/meteor/meteor.git ${checkoutPath}`);
    } catch (e) {
      if (e.code !== 'EEXIST') {
        console.log(e);
        return;
      }
    }
    sh.pushd(checkoutPath);
    sh.exec(`git checkout hot-module-reload`);
    sh.exec(`git fetch`);
    sh.popd();

    command = `${checkoutPath}/meteor`;
    additionalArgs = ['--extra-packages', 'hot-module-reload'];
  }

  start.spawn({
    command,
    args: [
      '--settings',
      'settings-dev.json',
      '--port',
      port,
      '--exclude-archs',
      'web.browser.legacy',
      ...additionalArgs,
    ],
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

prestart.stderr.on('data', error => {
  prestart.throw(error);
  process.exit(1);
});

prestart.process.once('exit', () => {
  runMicroservice();
});
