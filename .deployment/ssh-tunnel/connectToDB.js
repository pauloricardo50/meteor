import { writeYAML, executeCommand } from '../utils/helpers';
import openSSHTunnel, {
  PORT_OFFSET,
  MONGO_PORTS,
  MONGO_SERVICES,
  HOST,
} from './openSSHTunnel';

let SSH_ID;

const writeConnectToDBTmuxinator = environment => {
  return executeCommand(
    `cf env e-potek-ssh-tunnel-${environment}-${SSH_ID} | grep -e \\"database\\" -e \\"username\\" -e \\"password\\"`,
  )
    .then(res => JSON.parse(`{${res}}`))
    .then(({ database, password, username }) =>
      writeYAML({
        file: `${__dirname}/ssh-tunnel-${SSH_ID}.yml`,
        data: {
          name: `ssh-tunnel-${SSH_ID}`,
          root: '~/',
          on_project_exit: `cf delete e-potek-ssh-tunnel-${environment}-${SSH_ID} -r -f && rm -rf ${__dirname}/${environment}-${SSH_ID} && tmux kill-session -t ssh-tunnel-${SSH_ID}`,
          windows: [
            {
              sshTunnel: {
                layout: 'tiled',
                panes: [
                  {
                    sshTunnel: [
                      `${__dirname}/../../scripts/box_out.sh "SSH tunnel. Don't kill this pane."`,
                      `cf ssh -L ${Number(MONGO_PORTS[environment]) +
                        PORT_OFFSET}:${HOST}:${
                        MONGO_PORTS[environment]
                      } e-potek-ssh-tunnel-${environment}-${SSH_ID}`,
                    ],
                  },
                  {
                    mongodb: [
                      `${__dirname}/../../scripts/tcpWait.sh ${Number(
                        MONGO_PORTS[environment],
                      ) + PORT_OFFSET}`,
                      `${__dirname}/../../scripts/box_out.sh 'Mongo shell. Press CTRL-B + D to close the tunnel and kill the app.' ' ' 'If you want to connect with a GUI, use the following credentials:' ' ' 'host: localhost:${Number(
                        MONGO_PORTS[environment],
                      ) +
                        PORT_OFFSET}' 'database: ${database}' 'username: ${username}' 'password: ${password}'`,

                      `mongo localhost:${Number(MONGO_PORTS[environment]) +
                        PORT_OFFSET}/${database} --username ${username} --password ${password}`,
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
  return openSSHTunnel().then(({ environment, ssh_id }) => {
    SSH_ID = ssh_id;
    return writeConnectToDBTmuxinator(environment);
  });
};

main();
