const Nightmare = require('nightmare');
const cfenv = require('cfenv');

const appEnv = cfenv.getAppEnv();

const nightmare = new Nightmare({});

const checkTitle = title => {
  if (title !== 'Bienvenue sur e-Potek') {
    throw `Wrong title. Expected "Bienvenue sur e-Potek", got "${title}."`;
  }
  return;
};

nightmare
  .goto(appEnv.url)
  .evaluate(() => document.querySelector('h1').textContent)
  .end()
  .then(checkTitle)
  .then(() => console.log('Smoke test success!'))
  .catch(e => {
    const error = `Smoke test failed. Reason:\n${e}`;
    console.error(error);
    throw error;
  });
