const createCommand = commandName => (options = {}) => ({
  command: commandName,
  ...options,
});

const commands = [
  'listTemplates',
  'listServiceOfferings',
  'listNics',
  'associateIpAddress',
  'createSSHKeyPair',
  'deleteSSHKeyPair',
  'listSSHKeyPairs',
  'deployVirtualMachine',
  'createSecurityGroup',
  'listSecurityGroups',
  'authorizeSecurityGroupIngress',
  'listPublicIpAddresses',
  'listVirtualMachines',
];

const EXOSCALE_COMMANDS = commands.reduce(
  (acc, command) => ({
    ...acc,
    [command]: createCommand(command),
  }),
  {},
);

export default EXOSCALE_COMMANDS;
