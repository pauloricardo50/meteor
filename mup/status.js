const sh = require('shelljs');
const microservices = require('./microservices');

const environments = Object.keys(microservices);
const overview = process.argv.includes('--overview');

process.env.FORCE_COLOR = 1;

environments.forEach(env => {
  const [first] = microservices[env];
  sh.cd(env);

  console.log(`*** Status for ${env} ***`);
  sh.exec(`mup --config ${first}.mup.js docker status`);
  sh.exec(`mup --config ${first}.mup.js proxy status`);
  sh.exec(`mup --config ${first}.mup.js mongo status`);

  microservices[env].forEach(name => {
    sh.exec(
      `mup --config ${name}.mup.js meteor status ${
        overview ? '--overview' : ''
      }`,
    );
  });

  sh.cd('..');
});
