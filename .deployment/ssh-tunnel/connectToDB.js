import { writeYAML, executeCommand } from '../utils/helpers';
import openSSHTunnel, {
  SSH_ID,
  MONGO_PORTS,
  MONGO_SERVICES,
  HOST,
} from './openSSHTunnel';

const writeConnectToDBTmuxinator = environment => {
  return executeCommand(
    `cf env e-potek-ssh-tunnel-${environment}-${SSH_ID} | grep -e \\"database\\" -e \\"username\\" -e \\"password\\"`,
  )
    .then(res => JSON.parse(`{${res}}`))
    .then(({ database, password, username }) =>
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
                      }' 'database: ${database}' 'username: ${username}' 'password: ${password}'`,

                      `mongo localhost:${
                        MONGO_PORTS[environment]
                      }/${database} --username ${username} --password ${password}`,
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
  return openSSHTunnel().then(environment =>
    writeConnectToDBTmuxinator(environment),
  );
};

main();
