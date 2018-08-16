import ExoscaleService from './ExoscaleService';
import { VIRTUAL_MACHINES, FIREWALL, GENEVA_ZONEID } from './exoscaleConstants';

const exoscale = new ExoscaleService();

// exoscale
//   .createNewVirtualMachine({
//     keypair: 'e-potek-staging-ssh',
//     displayname: 'e-potek-staging',
//     name: 'e-potek-staging',
//     securitygroupnames: 'test',
//     ...VIRTUAL_MACHINES.UBUNTU_18_04_LTS_DISK_50G_MEMORY_4096MB_2CPU,
//   })
//   .then(console.log);

// exoscale
//   .createNewSecurityGroup({
//     name: 'test',
//   })
//   .then(console.log);

// exoscale.checkIfSecurityGroupExists({ name: 'test' }).then(console.log);

// exoscale
//   .listSecurityGroups()
//   .then(result => console.log(JSON.stringify(result, null, 4)));

// exoscale
//   .createSSHKeyPair({ name: 'test' })
//   .then((response) => {
//     console.log(response);
//     return exoscale.createSecurityGroup({
//       name: 'test',
//       description: 'test-description',
//     });
//   })
//   .then(() =>
//     exoscale.authorizeSecurityGroupIngress({
//       securityGroupName: 'test',
//       ...FIREWALL.INGRESS.SSH,
//     }))
//   .then(() =>
//     exoscale.authorizeSecurityGroupIngress({
//       securityGroupName: 'test',
//       ...FIREWALL.INGRESS.PING,
//     }))
//   .then(() =>
//     exoscale.authorizeSecurityGroupIngress({
//       securityGroupName: 'test',
//       ...FIREWALL.INGRESS.HTTP,
//     }))
//   .then(() =>
//     exoscale.authorizeSecurityGroupIngress({
//       securityGroupName: 'test',
//       ...FIREWALL.INGRESS.HTTPS,
//     }))
//   .catch(console.log);

// exoscale
//   .getVirtualMachineIdByName({ name: 'staging' })
//   .then(id => exoscale.listNics({ virtualMachineId: id }))
//   .then(console.log);

exoscale.listSecurityGroups().then(console.log);
