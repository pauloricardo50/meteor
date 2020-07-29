import path from 'path';

import Process from '../../../scripts/npm-scripts/scripts/Process';
import runBackend from '../../../scripts/npm-scripts/scripts/run-backend';

const backend = new Process();
const start = new Process();

runBackend({ process: backend });

start.spawn({
  command: 'npm',
  args: ['run', 'develop', '--', '-p', '3000'],
  options: { cwd: path.resolve(__dirname, '..'), env: process.env },
});

start.process.once('exit', () => {
  if (backend.process) {
    backend.kill();
  }
});
