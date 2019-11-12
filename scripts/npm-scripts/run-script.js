import { MICROSERVICES, SCRIPTS } from './constants';

const { spawn } = require('child_process');

const [script, ...args] = process.argv.slice(2);
const microservice = process
  .cwd()
  .split('/')
  .slice(-1)[0];

if (!Object.values(MICROSERVICES).includes(microservice)) {
  throw new Error(
    `Unknown microservice "${microservice}". Available microservices:\n${Object.values(
      MICROSERVICES,
    )
      .map(m => `"${m}"`)
      .join(', ')}`,
  );
}

if (!script) {
  throw new Error(
    'Script argument not provided. Usage: "node -r esm run-script.js <script>"',
  );
}

if (!Object.keys(SCRIPTS).includes(script)) {
  throw new Error(
    `Unknown script "${script}". Available scripts:\n${Object.keys(SCRIPTS)
      .map(s => `"${s}"`)
      .join(', ')}`,
  );
}

const scriptProcess = spawn(
  'node',
  ['-r', 'esm', SCRIPTS[script], microservice, ...args],
  {
    cwd: `${__dirname}/scripts`,
    stdio: 'inherit',
  },
);

scriptProcess.once('exit', code => {
  process.exit(code);
});
