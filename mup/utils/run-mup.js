const sh = require('shelljs');
const path = require('path');

// Force mup to use color in output
process.env.FORCE_COLOR = 1;

const mupPath = path.resolve(__dirname, '../../node_modules/.bin/mup');

module.exports = function runMup(command) {
  sh.exec(`${mupPath} ${command}`);
};
