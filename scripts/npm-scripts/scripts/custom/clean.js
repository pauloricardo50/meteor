import Process from '../Process';

const path = require('path');

const [microservice, ...args] = process.argv.slice(2);

const clean = new Process();

clean.spawn({
  command: 'rm',
  args: ['-rf', 'node_modules/', '&&', 'meteor', 'npm', 'install'],
  options: {
    cwd: path.resolve(__dirname, `../../../../microservices/${microservice}`),
    stdio: 'inherit',
  },
});
