import {
  generateServiceName,
  FORMATTED_ENVIRONMENTS,
} from '../settings/settings';
import { ENVIRONMENT, SERVICES } from '../settings/config';
import { writeYAML, touchFile, mkdir, executeCommand } from '../utils/helpers';
import CloudFoundryService from '../CloudFoundry/CloudFoundryService';
import argv from 'yargs';

const SSH_ID = Math.random()
  .toString(36)
  .substring(7);

const MONGO_SERVICES = {
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
const MONGO_PORTS = {
  [ENVIRONMENT.STAGING]: 38842,
  [ENVIRONMENT.PRODUCTION]: 53615,
};

const HOST = 'kubernetes-service-node.service.consul';

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

const writeTmuxinator = environment => {
  return executeCommand(
    `cf env e-potek-ssh-tunnel-${environment}-${SSH_ID} | grep -e \\"database\\" -e \\"username\\" -e \\"password\\"`,
  )
    .then(res => JSON.parse(`{${res}}`))
    .then(auth =>
      writeYAML({
        file: `${__dirname}/ssh-tunnel.yml`,
        data: {
          name: 'ssh-tunnel',
          root: '~/',
          on_project_exit: `cf delete e-potek-ssh-tunnel-${environment}-${SSH_ID} -r -f && rm -rf ${__dirname}/${environment} && tmux kill-session -t ssh-tunnel`,
          windows: [
            {
              sshTunnel: {
                layout: 'tiled',
                panes: [
                  {
                    sshTunnel: [
                      `${__dirname}/../../scripts/box_out.sh "SSH tunnel. Don't kill this pane."`,
                      `cf ssh -L ${MONGO_PORTS[environment]}:${HOST}:${
                        MONGO_PORTS[environment]
                      } e-potek-ssh-tunnel-${environment}-${SSH_ID}`,
                    ],
                  },
                  {
                    mongodb: [
                      `${__dirname}/../../scripts/tcpWait.sh ${
                        MONGO_PORTS[environment]
                      }`,
                      `${__dirname}/../../scripts/box_out.sh 'Mongo shell. Press CTRL-B + D to close the tunnel and kill the app.' ' ' 'If you want to connect with a GUI, use the following credentials:' ' ' 'host: localhost:${
                        MONGO_PORTS[environment]
                      }' 'database: ${auth.database}' 'username: ${
                        auth.username
                      }' 'password: ${auth.password}'`,

                      `mongo localhost:${MONGO_PORTS[environment]}/${
                        auth.database
                      } --username ${auth.username} --password ${
                        auth.password
                      }`,
                    ],
                  },
                ],
              },
            },
          ],
        },
      }),
    );
};

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
    .then(() => writeTmuxinator(environment));
};

main();
