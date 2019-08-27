import Process from '../Process';

const path = require('path');

const [microservice, ...args] = process.argv.slice(2);

const debug = new Process();

debug.spawn({
  command: 'node',
  args: [
    '-r',
    'esm',
    '../../scripts/npm-scripts/run-script.js',
    'start',
    '--',
    '--inspect',
  ],
  options: {
    cwd: path.resolve(__dirname, `../../../../microservices/${microservice}`),
    stdio: 'inherit',
  },
});
