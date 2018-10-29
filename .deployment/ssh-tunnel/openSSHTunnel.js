import {
  generateServiceName,
  FORMATTED_ENVIRONMENTS,
} from '../settings/settings';
import { ENVIRONMENT, SERVICES } from '../settings/config';
import { writeYAML, touchFile, mkdir, executeCommand } from '../utils/helpers';
import CloudFoundryService from '../CloudFoundry/CloudFoundryService';
import argv from 'yargs';

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

const openSSHTunnel = () => {
  const { environment, ssh_id } = argv
    .usage('Usage: $0 [options]]')
    .example(
      '$0 -e staging',
      'Establishes a SSH tunnel with staging mongo service',
    )
    .alias('e', 'environment')
    .nargs('e', 1)
    .describe('e', `Environment ${FORMATTED_ENVIRONMENTS}`)
    .alias('i', 'ssh_id')
    .nargs('i', 1)
    .describe('i', `Random id for the application`)
    .demandOption(['e', 'i'])
    .help('h')
    .alias('h', 'help').argv;

  SSH_ID = ssh_id;

  return mkdir(`${__dirname}/${environment}-${SSH_ID}/`)
    .then(() => writeApplicationManifest(environment))
    .then(() => touchFile(`${__dirname}/${environment}-${SSH_ID}/blank`))
    .then(() => CloudFoundryService.selectSpace(environment))
    .then(() =>
      CloudFoundryService.pushApplication(
        `${__dirname}/${environment}-${SSH_ID}/`,
      ),
    )
    .then(() => ({
      environment,
      ssh_id,
    }));
};

export default openSSHTunnel;
