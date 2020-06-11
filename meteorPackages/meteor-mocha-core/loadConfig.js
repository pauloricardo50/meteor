import fs from 'fs';

const pwd = process.env.PWD;

let config = {};

// Attempt to load .mocharc.js
try {
  const configFile = fs.readFileSync(`${pwd}/.mocharc.js`);
  config = eval(configFile.toString());
} catch (error) {
  // Config is not set
}

// Attempt to load .mocharc.json
try {
  if (!config) {
    const configFile = fs.readFileSync(`${pwd}/.mocharc.json`);
    config = JSON.parse(configFile.toString());
  }
} catch (error2) {
  // Config is not set
}

__meteor_runtime_config__['meteortesting:mocha-core_config'] = JSON.stringify(
  config,
);

export default config;
