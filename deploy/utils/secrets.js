const sh = require('shelljs');
const chalk = require('chalk');

const PROJECT_ID = 'e-potek-1499177443071';

module.exports = {
  retrieveSecret(name) {
    sh.set('-e');

    console.log(chalk.dim(`Retrieving value for "${name}" secret`));

    // `--quiet` is supposed to do the same thing, but
    // there are still some prompts that are only disabled with
    // the environment variable.
    sh.env.CLOUDSDK_CORE_DISABLE_PROMPTS = 1;

    const output = sh.exec(
      `gcloud beta secrets versions list ${name} --format=json --quiet --project=${PROJECT_ID}`,
      { silent: true },
    ).stdout;

    const versions = JSON.parse(output);

    const activeVersion = versions
      .find(version => version.state === 'ENABLED')
      .name.split('/')
      .pop();

    const value = sh.exec(
      `gcloud beta secrets versions access ${activeVersion} --secret=${name} --project=${PROJECT_ID}`,
      { silent: true },
    ).stdout;

    try {
      return JSON.parse(value);
    } catch (e) {
      // Probably is a string
      return value;
    }
  },
};
