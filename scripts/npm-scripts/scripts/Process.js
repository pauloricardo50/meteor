const { spawn } = require('child_process');

class Process {
  constructor({ throwOnError = false, processName = '' } = {}) {
    this.throwOnError = throwOnError;
    this.processName = processName ? `[${processName.toUpperCase()}]` : '';
    this.error = '';
  }

  spawn({ command, args = [], options = {} }) {
    this.process = spawn(command, args, {
      stdio: ['inherit', 'inherit', 'pipe'],
      ...options,
    });
  }

  kill() {
    this.process.kill();
  }

  get stdout() {
    return this.process.stdout;
  }

  get stderr() {
    return this.process.stderr;
  }

  log(data) {
    console.log(`${this.processName} ${data}`);
  }

  logError(error) {
    console.log('\x1b[31m%s\x1b[0m', `${this.processName} ${error}`);
  }

  throw(error) {
    this.logError(error);
    throw error;
  }
}

export default Process;
