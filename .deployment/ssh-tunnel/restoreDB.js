import { writeYAML, executeCommand } from '../utils/helpers';
import openSSHTunnel, {
  PORT_OFFSET,
  MONGO_SERVICES,
  HOST,
} from './openSSHTunnel';

let SSH_ID;

const writeRestoreDBTmuxinator = environment => {
  return executeCommand(
    `cf env e-potek-ssh-tunnel-${environment}-${SSH_ID} | grep -e \\"database\\" -e \\"username\\" -e \\"password\\" -e \\"ports\\"`,
  )
    .then(res => JSON.parse(`{${res}}`))
    .then(({ database, password, username, ports }) => {
      const mongoPort = ports.split(',')[0];
      return writeYAML({
        file: `${__dirname}/ssh-tunnel-${SSH_ID}.yml`,
        data: {
          name: `restore-db-${SSH_ID}`,
          root: '~/',
          on_project_exit: `cf delete e-potek-ssh-tunnel-${environment}-${SSH_ID} -r -f && rm -rf ${__dirname}/${environment}-${SSH_ID} && tmux kill-session -t restore-db-${SSH_ID}`,
          windows: [
            {
              sshTunnel: {
                layout: 'tiled',
                panes: [
                  {
                    sshTunnel: [
                      `${__dirname}/../../scripts/box_out.sh "SSH tunnel. Don't kill this pane."`,
                      `cf ssh -L ${Number(mongoPort) +
                        PORT_OFFSET}:${HOST}:${mongoPort} e-potek-ssh-tunnel-${environment}-${SSH_ID}`,
                    ],
                  },
                  {
                    mongodb: [
                      `${__dirname}/../../scripts/tcpWait.sh ${Number(
                        mongoPort,
                      ) + PORT_OFFSET}`,

                      `${__dirname}/../../scripts/box_out.sh 'Mongo shell. Press CTRL-B + D to close the tunnel and kill the app.' ' ' 'If you want to connect with a GUI, use the following credentials:' ' ' 'host: localhost:${Number(
                        mongoPort,
                      ) +
                        PORT_OFFSET}' 'database: ${database}' 'username: ${username}' 'password: ${password}'`,

                      `mongodump -h localhost:${Number(mongoPort) +
                        PORT_OFFSET} -d ${database} -u ${username} -p ${password} -o /tmp`,

                      `mongorestore -h localhost:5001 -d meteor /tmp/${database}`,

                      `rm -rf /tmp/${database}`,

                      `tmux kill-session -t restore-db-${SSH_ID}`,
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
  return openSSHTunnel().then(({ environment, ssh_id }) => {
    SSH_ID = ssh_id;
    return writeRestoreDBTmuxinator(environment);
  });
};

main();
