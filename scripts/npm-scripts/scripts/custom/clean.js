import Process from '../Process';

const path = require('path');

const [microservice, ...args] = process.argv.slice(2);

const clean = new Process();
const install = new Process();

clean.spawn({
  command: 'rm',
  args: ['-rf', 'node_modules/'],
  options: {
    cwd: path.resolve(__dirname, `../../../../microservices/${microservice}`),
    stdio: 'inherit',
  },
});

clean.process.once('exit', () => {
  install.spawn({
    command: 'meteor',
    args: ['npm', 'i'],
    options: {
      cwd: path.resolve(__dirname, `../../../../microservices/${microservice}`),
      stdio: 'inherit',
    },
  });
});
