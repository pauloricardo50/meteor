const sh = require('shelljs');
const path = require('path');

// Force mup to use color in output
process.env.FORCE_COLOR = 1;

const mupPath = path.resolve(__dirname, '../../node_modules/.bin/mup');

function getFullCommand(command) {
  return `${mupPath} ${command}`;
}

function runMup(command) {
  return sh.exec(getFullCommand(command));
}

module.exports = {
  getFullCommand,
  runMup,
};
