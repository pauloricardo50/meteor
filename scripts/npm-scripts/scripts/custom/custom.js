import Process from '../Process';

const path = require('path');

const CUSTOM_SCRIPTS = {
  clean: 'clean.js',
  inline: null,
};

const [microservice, script, ...args] = process.argv.slice(2);

const custom = new Process();

if (!script) {
  throw new Error('Custom script argument not provided. Usage: "node -r esm run-script.js custom <custom_script>"');
}

if (!Object.keys(CUSTOM_SCRIPTS).includes(script)) {
  throw new Error(`Unknown custom script "${script}". Available custom scripts:\n${Object.keys(CUSTOM_SCRIPTS)
    .map(s => `"${s}"`)
    .join(', ')}`);
}

if (CUSTOM_SCRIPTS[script]) {
  custom.spawn({
    command: 'node',
    args: ['-r', 'esm', CUSTOM_SCRIPTS[script], microservice, ...args],
    options: {
      cwd: __dirname,
      stdio: 'inherit',
    },
  });
} else {
  const [inlineCommand, ...inlineArgs] = args;
  custom.spawn({
    command: inlineCommand,
    args: inlineArgs,
    options: {
      cwd: path.resolve(__dirname, `../../../../microservices/${microservice}`),
      stdio: 'inherit',
    },
  });
}
