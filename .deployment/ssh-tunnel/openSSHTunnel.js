import {
  generateServiceName,
  FORMATTED_ENVIRONMENTS,
} from '../settings/settings';
import { ENVIRONMENT, SERVICES } from '../settings/config';
import { writeYAML, touchFile, mkdir, executeCommand } from '../utils/helpers';
import CloudFoundryService from '../CloudFoundry/CloudFoundryService';
import argv from 'yargs';

export const SSH_ID = Math.random()
  .toString(36)
  .substring(7);

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

//Shouldn't change
export const MONGO_PORTS = {
  [ENVIRONMENT.STAGING]: 38842,
  [ENVIRONMENT.PRODUCTION]: 53615,
};

export const HOST = 'kubernetes-service-node.service.consul';

const applicationManifestData = environment => ({
  applications: [
    {
      name: `e-potek-ssh-tunnel-${environment}-${SSH_ID}`,
      memory: '128M',
      instances: 1,
      buildpacks: ['https://github.com/cloudfoundry/staticfile-buildpack.git'],
      services: [MONGO_SERVICES[environment]],
      'random-route': true,
    },
  ],
});

const writeApplicationManifest = environment =>
  writeYAML({
    file: `${__dirname}/${environment}/manifest.yml`,
    data: applicationManifestData(environment),
  });

const openSSHTunnel = () => {
  const { environment } = argv
    .usage('Usage: $0 [options]]')
    .example(
      '$0 -e staging',
      'Establishes a SSH tunnel with staging mongo service',
    )
    .alias('e', 'environment')
    .nargs('e', 1)
    .describe('e', `Environment ${FORMATTED_ENVIRONMENTS}`)
    .demandOption(['e'])
    .help('h')
    .alias('h', 'help').argv;

  return mkdir(`${__dirname}/${environment}/`)
    .then(() => writeApplicationManifest(environment))
    .then(() => touchFile(`${__dirname}/${environment}/blank`))
    .then(() => CloudFoundryService.selectSpace(environment))
    .then(() =>
      CloudFoundryService.pushApplication(`${__dirname}/${environment}/`),
    )
    .then(() => environment);
};

export default openSSHTunnel;
