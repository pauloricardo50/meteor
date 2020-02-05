import { writeYAML } from '../utils/helpers';
import openSSHTunnel, { PORT_OFFSET, HOST } from './openSSHTunnel';

const writeConnectToDBTmuxinator = ({
  database,
  password,
  username,
  mongoPort,
  sshId,
  environment,
}) =>
  writeYAML({
    file: `${__dirname}/ssh-tunnel-${sshId}.yml`,
    data: {
      name: `ssh-tunnel-${sshId}`,
      root: '~/',
      on_project_exit: `cf delete e-potek-ssh-tunnel-${environment}-${sshId} -r -f && rm -rf ${__dirname}/${environment}-${sshId} && tmux kill-session -t ssh-tunnel-${sshId}`,
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
                  `${__dirname}/../../scripts/box_out.sh 'Mongo shell. Press CTRL-B + D to close the tunnel and kill the app.' ' ' 'If you want to connect with a GUI, use the following credentials:' ' ' 'host: localhost:${(mongoPort,
                  +PORT_OFFSET)}' 'database: ${database}' 'username: ${username}' 'password: ${password}'`,

                  `mongo localhost:${mongoPort +
                    PORT_OFFSET}/${database} --username ${username} --password ${password}`,
                ],
              },
            ],
          },
        },
      ],
    },
  });

const main = () =>
  openSSHTunnel().then(credentials => writeConnectToDBTmuxinator(credentials));

main();
