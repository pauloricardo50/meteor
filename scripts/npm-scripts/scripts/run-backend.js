import { MICROSERVICE_PORTS } from '../constants';

const { Observable } = require('rxjs');

const net = require('net');
const path = require('path');

const runBackend = (process, ...args) =>
  new Observable((observer) => {
    const listener = net
      .createServer()
      .once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          observer.next('Backend already running');
          observer.complete();
        }
        observer.error(new Error(err));
      })
      .once('listening', () => {
        listener
          .once('close', () => {
            const testMode = args.includes('--test');
            process.spawn({
              command: 'npm',
              args: ['run', testMode ? 'start-test' : 'start'],
              options: {
                cwd: path.resolve(__dirname, '../../../microservices/backend'),
              },
            });

            process.stdout.on('data', (data) => {
              observer.next(data.toString());
              if (data.toString().includes('App running at')) {
                observer.complete();
              }
            });

            process.stderr.on('data', (error) => {
              console.error(error.toString());
            });
          })
          .close();
      })
      .listen(MICROSERVICE_PORTS.backend, '0.0.0.0');
  });

export default runBackend;
