/* eslint-disable no-console */
// Usage: node ./run-with-backend <microservice> <command>
// command defaults to "start"

const {
  spawn,
} = require('child_process');
const net = require('net');
const path = require('path');

const BACKEND_PORT = 5500;

const [
  microservice,
  script = 'start',
] = process.argv.slice(2);
const fullAppTests = process.argv.includes('--full-app-tests');

if (!microservice) {
  throw new Error('Microservice argument not provided. Usage: "node run-with-backend.js <microservice>" ');
}

function startMeteor(_microservice, _script = script) {
  spawn(
    'npm',
    ['run', _script],
    {
      cwd: path.resolve(__dirname, `../microservices/${_microservice}`),
      stdio: 'inherit',
    },
  );
}

// Check if microservice is running by checking its port is in use
const listener = net.createServer()
  .once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log('=> Backend already running');
      return;
    }

    console.error('=> Unable to check if Backend is running', err.code);
  })
  .once('listening', () => {
    listener.once('close', () => {
      startMeteor('backend', fullAppTests ? 'start-e2e' : 'start');
    });

    listener.close();
  })
  .listen(BACKEND_PORT);

startMeteor(microservice);
