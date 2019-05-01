import argv from 'yargs';
import {
  generateServiceName,
  FORMATTED_ENVIRONMENTS,
} from '../settings/settings';
import { ENVIRONMENT, SERVICES } from '../settings/config';
import { writeYAML, touchFile, mkdir, executeCommand } from '../utils/helpers';
import CloudFoundryService from '../CloudFoundry/CloudFoundryService';

let SSH_ID;
export const PORT_OFFSET = Math.round(Math.random() * 100);

export const MONGO_SERVICES = {
  [ENVIRONMENT.STAGING]: generateServiceName({
    environment: ENVIRONMENT.STAGING,
    service: SERVICES.MONGODB,
  }),
  [ENVIRONMENT.PRODUCTION]: generateServiceName({
    environment: ENVIRONMENT.PRODUCTION,
    service: SERVICES.MONGODB,
  }),
};

export const REDIS_SERVICES = {
  [ENVIRONMENT.STAGING]: generateServiceName({
    environment: ENVIRONMENT.STAGING,
    service: SERVICES.REDIS,
  }),
  [ENVIRONMENT.PRODUCTION]: generateServiceName({
    environment: ENVIRONMENT.PRODUCTION,
    service: SERVICES.REDIS,
  }),
};

export const HOST = 'kubernetes-service-node.service.consul';

const applicationManifestData = environment => ({
  applications: [
    {
      name: `e-potek-ssh-tunnel-${environment}-${SSH_ID}`,
      memory: '64M',
      instances: 1,
      buildpacks: ['https://github.com/cloudfoundry/staticfile-buildpack.git'],
      services: [MONGO_SERVICES[environment]],
      'random-route': true,
    },
  ],
});

const writeApplicationManifest = environment =>
  writeYAML({
    file: `${__dirname}/${environment}-${SSH_ID}/manifest.yml`,
    data: applicationManifestData(environment),
  });

// Parse and remove any trailing comma from the credentials
const cleanCredentials = creds => {
  const res = JSON.parse(
    '{' +
      creds
        .split('\n')
        .map(line => line.replace(/,\s*$/, ''))
        // Filter out some empty character lines, if this causes
        // valid lines to be filtered, find a better solution
        .filter(str => str && str.length >= 5)
        .join(',') +
      '}',
  );
  return res;
};

const openSSHTunnel = ({ sshIdNumber = 0, environmentOverride } = {}) => {
  let environment;
  const args = argv
    .usage('Usage: $0 [options]]')
    .example(
      '$0 -e staging',
      'Establishes a SSH tunnel with staging mongo service',
    )
    .alias('e', 'environment')
    .nargs('e', 1)
    .describe('e', `Environment ${FORMATTED_ENVIRONMENTS}`)
    .alias('i', 'ssh_id')
    .array('i')
    .describe('i', 'Random id for the application')
    .demandOption(['e', 'i'])
    .help('h')
    .alias('h', 'help').argv;

  if (environmentOverride) {
    environment = environmentOverride;
  } else {
    environment = args.environment;
  }

  SSH_ID = args.ssh_id[sshIdNumber];

  return mkdir(`${__dirname}/${environment}-${SSH_ID}/`)
    .then(() => writeApplicationManifest(environment))
    .then(() => touchFile(`${__dirname}/${environment}-${SSH_ID}/blank`))
    .then(() => CloudFoundryService.selectSpace(environment))
    .then(() =>
      CloudFoundryService.pushApplication(
        `${__dirname}/${environment}-${SSH_ID}/`,
      ),
    )
    .then(() =>
      executeCommand(
        `cf env e-potek-ssh-tunnel-${environment}-${SSH_ID} | grep -e \\"database\\" -e \\"username\\" -e \\"password\\" -e \\"ports\\"`,
      ),
    )
    .then(credentials => ({
      ...cleanCredentials(credentials),
      mongoPort: Number(cleanCredentials(credentials).ports.split(',')[2]),
      sshId: SSH_ID,
      environment,
    }));
};

export default openSSHTunnel;
