import { writeYAML, executeCommand } from '../utils/helpers';
import openSSHTunnel, { PORT_OFFSET, HOST } from './openSSHTunnel';

let prod = {};
let dev = {};

const writeProdToDevTmuxinator = () =>
  writeYAML({
    file: `${__dirname}/ssh-tunnel-${prod.sshId}.yml`,
    data: {
      name: `restore-db-${prod.sshId}`,
      root: '~/',
      on_project_exit: `cf target -s Dev && cf delete e-potek-ssh-tunnel-dev-${dev.sshId} -r -f && cf target -s Production && cf delete e-potek-ssh-tunnel-production-${prod.sshId} -r -f && rm -rf ${__dirname}/dev-${dev.sshId} && rm -rf ${__dirname}/production-${prod.sshId}`,
      windows: [
        {
          sshTunnel: {
            layout: 'tiled',
            panes: [
              {
                sshTunnel: [
                  `${__dirname}/../../scripts/box_out.sh "SSH tunnel. Don't kill this pane."`,
                  `cf target -s dev; and cf ssh -L ${dev.mongoPort +
                    PORT_OFFSET}:${HOST}:${
                    dev.mongoPort
                  } e-potek-ssh-tunnel-dev-${dev.sshId}`,
                ],
              },
              {
                sshTunnel: [
                  `${__dirname}/../../scripts/box_out.sh "SSH tunnel. Don't kill this pane."`,
                  `sleep 5; and cf target -s Production; and cf ssh -L ${prod.mongoPort +
                    PORT_OFFSET}:${HOST}:${
                    prod.mongoPort
                  } e-potek-ssh-tunnel-production-${prod.sshId}`,
                ],
              },
              {
                mongodb: [
                  `${__dirname}/../../scripts/tcpWait.sh ${prod.mongoPort +
                    PORT_OFFSET}`,

                  `${__dirname}/../../scripts/box_out.sh 'Mongo shell. Press CTRL-B + D to close the tunnel and kill the app.' ' ' 'If you want to connect with a GUI, use the following credentials:' ' ' 'host: localhost:${prod.mongoPort +
                    PORT_OFFSET}' 'database: ${prod.database}' 'username: ${
                    prod.username
                  }' 'password: ${prod.password}'`,

                  `mongodump -h localhost:${prod.mongoPort + PORT_OFFSET} -d ${
                    prod.database
                  } -u ${prod.username} -p ${prod.password} -o /tmp`,

                  `mongorestore --drop -h localhost:${dev.mongoPort +
                    PORT_OFFSET} -d ${dev.database} -u ${dev.username} -p ${
                    dev.password
                  } /tmp/${prod.database}`,

                  // `rm -rf /tmp/${prod.database}`,

                  // `tmux kill-session -t restore-db-${prod.sshId}`,
                ],
              },
            ],
          },
        },
      ],
    },
  });

const main = () =>
  executeCommand(`cf target -s Production`)
    .then(() =>
      openSSHTunnel({
        sshIdNumber: 0,
        // If you get "Authentication failed" "Unreachable servers", try changing
        // mongoPort between 0 and 2 to iterate between the replica sets
        // same for dev below
        mongoPort: 0,
        environmentOverride: 'production',
      }),
    )
    .then(credentials => {
      prod = credentials;
    })
    .then(() => executeCommand(`cf target -s dev`))
    .then(() =>
      openSSHTunnel({
        sshIdNumber: 1,
        mongoPort: 0,
        environmentOverride: 'dev',
      }),
    )
    .then(credentials => {
      dev = credentials;
      return writeProdToDevTmuxinator();
    })
    .catch((...errors) => {
      console.log('Production to dev DB error', ...errors);
    });

main();
