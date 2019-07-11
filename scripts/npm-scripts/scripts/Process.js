const { spawn } = require('child_process');

class Process {
  spawn({ command, args = [], options = {} }) {
    this.process = spawn(command, args, options);
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

  startLogging() {
    this.process.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    this.process.stderr.on('data', (error) => {
      console.log(error.toString());
    });
  }
}

export default Process;
