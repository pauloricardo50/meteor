import Process from './Process';

const path = require('path');

const [microservice] = process.argv.slice(2);

const updateMeteorPackages = new Process();

updateMeteorPackages.spawn({
  command: 'meteor',
  args: ['update', '--all-packages'],
  options: {
    cwd: path.resolve(__dirname, `../../../microservices/${microservice}`),
    env: {
      ...process.env,
      METEOR_PACKAGE_DIRS: 'packages:../../meteorPackages',
    },
  },
});
