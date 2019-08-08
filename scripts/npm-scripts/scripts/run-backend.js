import { MICROSERVICE_PORTS } from '../constants';

const net = require('net');
const path = require('path');

const runBackend = (process, ...args) => {
  const listener = net
    .createServer()
    .once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        process.logError('Backend already running');
      } else {
        process.throw(err);
      }
    })
    .once('listening', () => {
      listener
        .once('close', () => {
          const testMode = args.includes('--test');

          process.spawn({
            command: 'tmux',
            args: [
              'new',
              '-d',
              '-s',
              testMode ? 'backend-test' : 'backend',
              '"npm',
              'run',
              testMode ? 'start-test"' : 'start"',
            ],
            options: {
              cwd: path.resolve(__dirname, '../../../microservices/backend'),
              shell: true,
            },
          });
        })
        .close();
    })
    .listen(MICROSERVICE_PORTS.backend, '0.0.0.0');
};

export default runBackend;
