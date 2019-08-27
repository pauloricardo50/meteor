import Process from '../Process';

const path = require('path');

const [microservice, ...args] = process.argv.slice(2);

const testDebug = new Process();

testDebug.spawn({
  command: 'node',
  args: [
    '-r',
    'esm',
    '../../scripts/npm-scripts/run-script.js',
    'test',
    '--',
    '--debug-port',
    '5858',
  ],
  options: {
    cwd: path.resolve(__dirname, `../../../../microservices/${microservice}`),
    stdio: 'inherit',
  },
});
