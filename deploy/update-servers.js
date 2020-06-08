const Compute = require('@google-cloud/compute');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { retrieveSecret } = require('./utils/secrets.js');

console.log(chalk.blue('=> Updating the <env>-servers.json files'));

const secret = retrieveSecret('deploy-engine-credentials');
const compute = new Compute({
  projectId: 'e-potek-1499177443071',
  credentials: secret,
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
        chalk.bgYellowBright
          .black`!!!! Server "${vm.name}" does not have an external address !!!!`,
      );
    }

    const internal = metadata[0].networkInterfaces[0].networkIP;
    console.log(
      chalk.dim(`${vm.id} - external: ${external} - internal ${internal}`),
    );

    const serverName = vm.name;
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
