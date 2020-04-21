import { MICROSERVICE_PORTS } from '../constants';

const net = require('net');
const path = require('path');

const serializeEnv = (env = {}) =>
  Object.keys(env)
    .map(key => `${key}=${env[key]}`)
    .join(' ');

const runBackend = ({ process, args = [], env }) => {
  const listener = net
    .createServer()
    .once('error', err => {
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

          try {
            const child = process.spawn({
              command: 'tmux',
              args: [
                `new -d -s ${testMode ? 'backend-test' : 'backend'}`,
                `"${env ? `${serializeEnv(env)} ` : ''}npm run ${
                  testMode ? 'start-test' : 'start'
                }"`,
              ],
              options: {
                cwd: path.resolve(__dirname, '../../../microservices/backend'),
                shell: true,
              },
            });

            child.on('error', error => {
              console.log('CHILD error event:', error);
            });

            child.on('close', code => {
              console.log(`child process close all stdio with code ${code}`);
            });

            child.on('exit', code => {
              console.log(`child process exited with code ${code}`);
            });
          } catch (error) {
            console.log('CHILD error:', error);
          }
        })
        .close();
    })
    .listen(MICROSERVICE_PORTS.backend, '0.0.0.0');
};

export default runBackend;
