import { writeYAML, executeCommand } from '../utils/helpers';
import openSSHTunnel, {
  PORT_OFFSET,
  MONGO_PORTS,
  MONGO_SERVICES,
  HOST,
} from './openSSHTunnel';

let SSH_ID_PRODUCTION;
let SSH_ID_STAGING;

let productionCredentials = {};
let stagingCredentials = {};

const writeProdToStagingTmuxinator = () => {
  return executeCommand(`cf target -s Production`)
    .then(() =>
      executeCommand(
        `cf env e-potek-ssh-tunnel-production-${SSH_ID_PRODUCTION} | grep -e \\"database\\" -e \\"username\\" -e \\"password\\" -e \\"ports\\"`,
      ),
    )
    .then(res => {
      const creds = JSON.parse(`{${res}}`);
      productionCredentials = {
        ...creds,
        mongoPort: Number(creds.ports.split(',')[0]),
      };
    })
    .then(() => executeCommand(`cf target -s Staging`))
    .then(() => {
      return executeCommand(
        `cf env e-potek-ssh-tunnel-staging-${SSH_ID_STAGING} | grep -e \\"database\\" -e \\"username\\" -e \\"password\\" -e \\"ports\\"`,
      );
    })
    .then(res => {
      const creds = JSON.parse(`{${res}}`);
      stagingCredentials = {
        ...creds,
        mongoPort: Number(creds.ports.split(',')[0]),
      };
    })
    .then(() => {
      return writeYAML({
        file: `${__dirname}/ssh-tunnel-${SSH_ID_PRODUCTION}.yml`,
        data: {
          name: `restore-db-${SSH_ID_PRODUCTION}`,
          root: '~/',
          on_project_exit: `cf target -s Staging && cf delete e-potek-ssh-tunnel-staging-${SSH_ID_STAGING} -r -f && cf target -s Production && cf delete e-potek-ssh-tunnel-production-${SSH_ID_PRODUCTION} -r -f && rm -rf ${__dirname}/staging-${SSH_ID_STAGING} && rm -rf ${__dirname}/production-${SSH_ID_PRODUCTION}`,
          windows: [
            {
              sshTunnel: {
                layout: 'tiled',
                panes: [
                  {
                    sshTunnel: [
                      `${__dirname}/../../scripts/box_out.sh "SSH tunnel. Don't kill this pane."`,
                      `cf target -s Staging; and cf ssh -L ${stagingCredentials.mongoPort +
                        PORT_OFFSET}:${HOST}:${
                        MONGO_PORTS['staging']
                      } e-potek-ssh-tunnel-staging-${SSH_ID_STAGING}`,
                    ],
                  },
                  {
                    sshTunnel: [
                      `${__dirname}/../../scripts/box_out.sh "SSH tunnel. Don't kill this pane."`,
                      `sleep 5; and cf target -s Production; and cf ssh -L ${productionCredentials.mongoPort +
                        PORT_OFFSET}:${HOST}:${
                        MONGO_PORTS['production']
                      } e-potek-ssh-tunnel-production-${SSH_ID_PRODUCTION}`,
                    ],
                  },
                  {
                    mongodb: [
                      `${__dirname}/../../scripts/tcpWait.sh ${productionCredentials.mongoPort +
                        PORT_OFFSET}`,

                      `${__dirname}/../../scripts/box_out.sh 'Mongo shell. Press CTRL-B + D to close the tunnel and kill the app.' ' ' 'If you want to connect with a GUI, use the following credentials:' ' ' 'host: localhost:${productionCredentials.mongoPort +
                        PORT_OFFSET}' 'database: ${
                        productionCredentials.database
                      }' 'username: ${
                        productionCredentials.username
                      }' 'password: ${productionCredentials.password}'`,

                      `mongodump -h localhost:${productionCredentials.mongoPort +
                        PORT_OFFSET} -d ${productionCredentials.database} -u ${
                        productionCredentials.username
                      } -p ${productionCredentials.password} -o /tmp`,

                      `mongorestore -h localhost:${stagingCredentials.mongoPort +
                        PORT_OFFSET} -d ${stagingCredentials.database} -u ${
                        stagingCredentials.username
                      } -p ${stagingCredentials.password} /tmp/${
                        productionCredentials.database
                      }`,

                      // `rm -rf /tmp/${productionCredentials.database}`,

                      // `tmux kill-session -t restore-db-${SSH_ID_PRODUCTION}`,
                    ],
                  },
                ],
              },
            },
          ],
        },
      });
    });
};

const main = () => {
  return openSSHTunnel({ sshIdNumber: 0, environmentOverride: 'production' })
    .then(({ ssh_id }) => {
      SSH_ID_PRODUCTION = ssh_id;
      console.log('SSH_ID_PRODUCTION', SSH_ID_PRODUCTION);
    })
    .then(() =>
      openSSHTunnel({ sshIdNumber: 1, environmentOverride: 'staging' }),
    )
    .then(({ ssh_id }) => {
      SSH_ID_STAGING = ssh_id;
      console.log('SSH_ID_STAGING', SSH_ID_STAGING);
      return writeProdToStagingTmuxinator();
    })
    .catch(error => {
      console.log(
        'Production to Staging DB error',
        JSON.stringify(error, null, 2),
      );
    });
};

main();
