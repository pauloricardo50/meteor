import { writeYAML } from '../utils/helpers';
import openSSHTunnel, { PORT_OFFSET, HOST } from './openSSHTunnel';

let SSH_ID;

const writePullDBTmuxinator = ({
  database,
  password,
  username,
  mongoPort,
  environment,
}) => {
  return writeYAML({
    file: `${__dirname}/ssh-tunnel-${SSH_ID}.yml`,
    data: {
      name: `restore-db-${SSH_ID}`,
      root: '~/',
      on_project_exit: `cf delete e-potek-ssh-tunnel-${environment}-${SSH_ID} -r -f && rm -rf ${__dirname}/${environment}-${SSH_ID}`,
      windows: [
        {
          sshTunnel: {
            layout: 'tiled',
            panes: [
              {
                sshTunnel: [
                  `${__dirname}/../../scripts/box_out.sh "SSH tunnel. Don't kill this pane."`,
                  `cf ssh -L ${mongoPort +
                    PORT_OFFSET}:${HOST}:${mongoPort} e-potek-ssh-tunnel-${environment}-${SSH_ID}`,
                ],
              },
              {
                mongodb: [
                  `${__dirname}/../../scripts/tcpWait.sh ${mongoPort +
                    PORT_OFFSET}`,

                  `${__dirname}/../../scripts/box_out.sh 'Mongo shell. Press CTRL-B + D to close the tunnel and kill the app.' ' ' 'If you want to connect with a GUI, use the following credentials:' ' ' 'host: localhost:${mongoPort +
                    PORT_OFFSET}' 'database: ${database}' 'username: ${username}' 'password: ${password}'`,

                  `mongodump -h localhost:${mongoPort +
                    PORT_OFFSET} -d ${database} -u ${username} -p ${password} -o /tmp`,

<<<<<<< HEAD
                      `mongorestore --drop -h localhost:5001 -d meteor /tmp/${database}`,
=======
                  `mongorestore --drop -h localhost:5001 -d meteor /tmp/${database}`,
>>>>>>> 5508ebcd5ced316a8e4b31ba9705041bc21ad246

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
};

const main = () =>
  openSSHTunnel().then(credentials => {
    return writePullDBTmuxinator(environment, credentials);
  });

main();
