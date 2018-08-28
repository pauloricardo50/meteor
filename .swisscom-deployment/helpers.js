import cmd from 'node-cmd';

export const executeCommand = command =>
  new Promise((resolve, reject) => {
    cmd.get(command, (err, data, stderr) => {
      if (err || stderr) {
        reject(err || stderr);
      }
      resolve(data);
    });
  });
