const Compute = require('@google-cloud/compute');
const fs = require('fs');
const path = require('path');

if (!fs.existsSync('./configs/credentials.json')) {
  console.error(
    'Please create the engine credentials as described in the docs',
  );
  process.exit(1);
}

const compute = new Compute({
  projectId: 'e-potek-1499177443071',
  keyFilename: './configs/credentials.json',
});

async function updateForGroup(name) {
  const zone = compute.zone('europe-west6-a');
  const instanceGroup = zone.instanceGroup(name);
  const servers = {};
  const [vms] = await instanceGroup.getVMs();

  for (let i = 0; i < vms.length; i += 1) {
    const vm = zone.vm(vms[i].id);
    // eslint-disable-next-line no-await-in-loop
    const metadata = await vm.getMetadata();
    const external = metadata[0].networkInterfaces[0].accessConfigs.find(
      config => config.name === 'External NAT',
    ).natIP;

    if (!external) {
      // server is stopped or doesn't have an external IP address
      console.warn(
        `!!!! Server "${metadata[0].name}" does not have an external address !!!!`,
      );
    }

    const internal = metadata[0].networkInterfaces[0].networkIP;
    console.log(vm.id, 'external:', external, 'internal', internal);

    const serverName = `${i}`;
    servers[serverName] = {
      host: external,
      username: 'mup',
      pem: '~/.ssh/epotek',
      privateIp: internal,
    };
  }

  const outputPath = path.resolve(__dirname, `configs/${name}-servers.json`);
  fs.writeFileSync(outputPath, JSON.stringify(servers, null, 2));
}

updateForGroup('prod');
updateForGroup('staging');
updateForGroup('api');
