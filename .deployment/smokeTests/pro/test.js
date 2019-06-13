const Nightmare = require('nightmare');
const cfenv = require('cfenv');
const assert = require('assert');

const appEnv = cfenv.getAppEnv();

const nightmare = new Nightmare({});

const TITLE = 'Accédez à votre compte e-Potek.';

const checkTitle = title => {
  assert(title === TITLE, `Wrong title: expected "${TITLE}", got "${title}"`);
};

nightmare
  .goto(`https://${appEnv.name}.scapp.io`)
  .wait(500)
  .evaluate(() => document.querySelector('h1').textContent)
  .end()
  .then(checkTitle)
  .then(() => console.log('Smoke test success!'))
  .catch(e => {
    const error = `Smoke test failed. Reason:\n${e}`;
    console.error(error);
    throw error;
  });
