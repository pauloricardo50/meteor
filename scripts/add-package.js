/**
 * Adds or updates a package for all microservices
 * Use: `node add-package package-name`
 * Example:
 * - node add-package jquery@3.0.0
 */
const sh = require('shelljs');
const path = require('path');
const microservices = require('./microservices');

const packages = process.argv.slice(2);

console.log(`Adding packages: ${packages.join(', ')}`);

// relative to microservice
sh.env.METEOR_PACKAGE_DIRS = '../../meteorPackages';

microservices.forEach(name => {
  console.log(`** Adding to ${name} **`);
  sh.cd(path.resolve(__dirname, `../microservices/${name}`));
  sh.exec(`meteor add ${packages.join(' ')}`);
});
