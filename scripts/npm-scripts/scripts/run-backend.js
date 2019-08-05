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
          const isCI = args.includes('--ci');
          if (isCI) {
            process.spawn({
              command: 'npm',
              args: ['run', testMode ? 'start-test' : 'start'],
              options: {
                cwd: path.resolve(__dirname, '../../../microservices/backend'),
              },
            });
          } else {
            process.spawn({
              command: 'screen',
              args: [
                '-S',
                'backend',
                '-d',
                '-m',
                'npm',
                'run',
                testMode ? 'start-test' : 'start',
              ],
              options: {
                cwd: path.resolve(__dirname, '../../../microservices/backend'),
              },
            });
          }
        })
        .close();
    })
    .listen(MICROSERVICE_PORTS.backend, '0.0.0.0');
};

export default runBackend;
