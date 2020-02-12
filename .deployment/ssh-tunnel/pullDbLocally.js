import { writeYAML } from '../utils/helpers';
import openSSHTunnel, { PORT_OFFSET, HOST } from './openSSHTunnel';

const writePullDBTmuxinator = ({
  database,
  password,
  username,
  mongoPort,
  environment,
  sshId,
  toLocalPort = '5501',
}) =>
  writeYAML({
    file: `${__dirname}/ssh-tunnel-${sshId}.yml`,
    data: {
      name: `restore-db-${sshId}`,
      root: '~/',
      on_project_exit: `cf delete e-potek-ssh-tunnel-${environment}-${sshId} -r -f && rm -rf ${__dirname}/${environment}-${sshId}`,
      windows: [
        {
          sshTunnel: {
            layout: 'tiled',
            panes: [
              {
                sshTunnel: [
                  `${__dirname}/../../scripts/box_out.sh "SSH tunnel. Don't kill this pane."`,
                  `cf ssh -L ${mongoPort +
                    PORT_OFFSET}:${HOST}:${mongoPort} e-potek-ssh-tunnel-${environment}-${sshId}`,
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

                  `mongorestore --drop -h localhost:${toLocalPort} -d meteor /tmp/${database}`,

                  `rm -rf /tmp/${database}`,

                  `tmux kill-session -t restore-db-${sshId}`,
                ],
              },
            ],
          },
        },
      ],
    },
  });

const main = () =>
  openSSHTunnel().then(credentials => writePullDBTmuxinator(credentials));

main();
