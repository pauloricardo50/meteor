import {
  generateMongoServiceName,
  FORMATTED_ENVIRONMENTS,
} from '../settings/settings';
import { ENVIRONMENT } from '../settings/config';
import {
  writeYAML,
  touchFile,
  mkdir,
  executeCommand,
  boxOut,
} from '../utils/helpers';
import CloudFoundryService from '../CloudFoundry/CloudFoundryService';
import argv from 'yargs';

const MONGO_SERVICES = {
  [ENVIRONMENT.STAGING]: generateMongoServiceName(ENVIRONMENT.STAGING),
  [ENVIRONMENT.PRODUCTION]: generateMongoServiceName(ENVIRONMENT.PRODUCTION),
};

//Shouldn't change
const MONGO_PORTS = {
  [ENVIRONMENT.STAGING]: 38842,
  [ENVIRONMENT.PRODUCTION]: 49918,
};

const HOST = 'kubernetes-service-node.service.consul';

const applicationManifestData = environment => ({
  applications: [
    {
      name: `e-potek-ssh-tunnel-${environment}`,
      memory: '128M',
      instances: 1,
      buildpack: 'https://github.com/cloudfoundry/staticfile-buildpack.git',
      services: [MONGO_SERVICES[environment]],
    },
  ],
});

const writeApplicationManifest = environment =>
  writeYAML({
    file: `${__dirname}/${environment}/manifest.yml`,
    data: applicationManifestData(environment),
  });

const getAuthentication = environment => {
  let authentication;
  return executeCommand(
    `cf env e-potek-ssh-tunnel-${environment} | grep -e \\"database\\" -e \\"username\\" -e \\"password\\"`,
  ).then(res => {
    authentication = JSON.parse(`{${res}}`);
    console.log('You can execute this command:');
    return boxOut(
      `mongo localhost:${MONGO_PORTS[environment]}/${
        authentication.database
      } --username ${authentication.username} --password ${
        authentication.password
      }`,
    ).then(() => {
      console.log(
        "Press CTRL-C to close the tunnel. Don't forget to delete the app afterwards:",
      );
      return boxOut(`cf delete e-potek-ssh-tunnel-${environment} -f`);
    });
  });
};

const establishSSHTunnel = environment =>
  getAuthentication(environment).then(() =>
    executeCommand(
      `cf ssh -L ${MONGO_PORTS[environment]}:${HOST}:${
        MONGO_PORTS[environment]
      } e-potek-ssh-tunnel-${environment}`,
    ),
  );

const main = () => {
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

  mkdir(`${__dirname}/${environment}/`)
    .then(() => writeApplicationManifest(environment))
    .then(() => touchFile(`${__dirname}/${environment}/blank`))
    .then(() => CloudFoundryService.selectSpace(environment))
    .then(() =>
      CloudFoundryService.pushApplication(`${__dirname}/${environment}/`),
    )
    .catch(console.log)
    .then(() => establishSSHTunnel(environment));
};

main();
