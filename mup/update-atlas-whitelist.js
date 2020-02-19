const sh = require('shelljs');
const DigestFetch = require('digest-fetch');
const auth = require('./configs/atlas-auth.json');

sh.exec('node update-servers');

const { log, error: logError } = console;

const neededStagingIps = [
  require('./configs/staging-servers.json'),
  require('./configs/prod-servers.json'),
  require('./configs/api-servers.json'),
]
  .map(Object.values)
  .flat()
  .map(({ host }) => host);

log('needed', neededStagingIps);

const PUBLIC_KEY = auth.publicKey;
const PRIVATE_KEY = auth.privateKey;
const PROJECT_ID = '5e31aad95538553602af0c98';

if (!PUBLIC_KEY) {
  logError('PUBLIC_KEY is missing in configs/atlas-auth.json');
  process.exit(1);
}
if (!PRIVATE_KEY) {
  logError('PRIVATE_KEY is missing in configs/atlas-auth.json');
  process.exit(1);
}

const client = new DigestFetch(PUBLIC_KEY, PRIVATE_KEY, {});
const stagingComment = 'google-cloud-staging';

const urlbase = 'https://cloud.mongodb.com/api/atlas/v1.0/';

async function updateWhitelist() {
  const { results: existing } = await client
    .fetch(`${urlbase}groups/${PROJECT_ID}/whitelist`, {})
    .then(res => res.json());

  const stagingIps = existing
    .filter(item => item.comment === 'google-cloud-staging')
    .map(item => item.ipAddress);
  const neededToAdd = neededStagingIps.filter(ip => !stagingIps.includes(ip));

  log('missing addresses:', neededToAdd);

  if (neededToAdd.length > 0) {
    const result = await client
      .fetch(`${urlbase}groups/${PROJECT_ID}/whitelist`, {
        method: 'POST',
        body: JSON.stringify(
          neededToAdd.map(address => ({
            ipAddress: address,
            comment: stagingComment,
          })),
        ),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => res.json());
    log(result);
  }

  log('whitelist up to date');
}

updateWhitelist();
