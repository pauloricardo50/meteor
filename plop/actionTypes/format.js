const cmd = require('node-cmd');

module.exports = (answers, config, plop) => {
  const command = `meteor npx eslint --fix ${config.path}`;
  return new Promise((resolve, reject) => {
    cmd
      .get(command, (err, data, stderr) => {
        if (stderr || err) {
          console.error(
            `Error while executing command ${command}: ${stderr || err}`,
          );
        }
        resolve('Successfully formatted files');
      })
      .stdout.on('data', console.log);
  });
};
