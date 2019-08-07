const { spawn } = require('child_process');

class Process {
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
    console.log(data);
  }

  logError(error) {
    console.log('\x1b[31m%s\x1b[0m', error);
  }

  throw(error) {
    this.logError(error);
    throw error;
  }
}

export default Process;
