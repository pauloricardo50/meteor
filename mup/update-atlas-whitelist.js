const sh = require('shelljs');
const DigestFetch = require('digest-fetch');

sh.exec('node update-servers');

const neededStagingIps = Object.values(require('./staging-servers.json')).map(
  ({ host }) => host,
);

const PUBLIC_KEY = process.env.ATLAS_PUBLIC_KEY;
const PRIVATE_KEY = process.env.ATLAS_PRIVATE_KEY;
const PROJECT_ID = '5e31aad95538553602af0c98';

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

  console.log('missing addresses:', neededToAdd);

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
    console.log(result);
  }

  console.log('whitelist up to date');
}

updateWhitelist();
