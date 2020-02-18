const sh = require('shelljs');
const microservices = require('./microservices');
const runMup = require('./utils/run-mup');

const environments = Object.keys(microservices);
const overview = process.argv.includes('--overview');

environments.forEach(env => {
  const [first] = microservices[env];
  sh.cd(env);

  console.log(`*** Status for ${env} ***`);
  runMup(`--config ${first}.mup.js docker status`);
  runMup(`--config ${first}.mup.js proxy status`);
  runMup(`--config ${first}.mup.js mongo status`);

  microservices[env].forEach(name => {
    runMup(
      `--config ${name}.mup.js meteor status ${overview ? '--overview' : ''}`,
    );
  });

  sh.cd('..');
});
