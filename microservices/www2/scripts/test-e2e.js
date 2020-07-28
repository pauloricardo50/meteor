import path from 'path';

import Process from '../../../scripts/npm-scripts/scripts/Process';
import runBackend from '../../../scripts/npm-scripts/scripts/run-backend';
import waitForServer from '../../../scripts/npm-scripts/scripts/waitForServer';

const backend = new Process();
const gatsby = new Process();
const cypress = new Process();

const GATBY_E2E_PORT = 3015;

runBackend({ process: backend, args: ['--test'] });

gatsby.spawn({
  command: 'npm',
  args: ['run', 'develop', '--', '-p', GATBY_E2E_PORT],
  options: {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, IS_E2E_TEST: true },
  },
});

gatsby.process.once('exit', () => {
  if (backend.process) {
    backend.kill();
  }
});

waitForServer({ port: GATBY_E2E_PORT, onError: () => gatsby.kill() }, () => {
  console.log('Running cypress...');
  cypress.spawn({
    command: '../../node_modules/cypress/bin/cypress',
    args: ['open'],
    options: {
      cwd: path.resolve(__dirname, '..'),
    },
  });

  cypress.process.once('exit', code => {
    if (backend.process) {
      backend.kill();
    }
    if (gatsby.process) {
      gatsby.kill();
    }
    process.exit(code);
  });
});
