import { writeYAML, executeCommand } from '../utils/helpers';
import openSSHTunnel, { PORT_OFFSET, HOST } from './openSSHTunnel';

let prod = {};
let staging = {};

const writeProdToStagingTmuxinator = () =>
  writeYAML({
    file: `${__dirname}/ssh-tunnel-${prod.sshId}.yml`,
    data: {
      name: `restore-db-${prod.sshId}`,
      root: '~/',
      on_project_exit: `cf target -s Staging && cf delete e-potek-ssh-tunnel-staging-${staging.sshId} -r -f && cf target -s Production && cf delete e-potek-ssh-tunnel-production-${prod.sshId} -r -f && rm -rf ${__dirname}/staging-${staging.sshId} && rm -rf ${__dirname}/production-${prod.sshId}`,
      windows: [
        {
          sshTunnel: {
            layout: 'tiled',
            panes: [
              {
                sshTunnel: [
                  `${__dirname}/../../scripts/box_out.sh "SSH tunnel. Don't kill this pane."`,
                  `cf target -s Staging; and cf ssh -L ${staging.mongoPort +
                    PORT_OFFSET}:${HOST}:${
                    staging.mongoPort
                  } e-potek-ssh-tunnel-staging-${staging.sshId}`,
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

                  `mongorestore --drop -h localhost:${staging.mongoPort +
                    PORT_OFFSET} -d ${staging.database} -u ${
                    staging.username
                  } -p ${staging.password} /tmp/${prod.database}`,

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
        // same for staging below
        mongoPort: 0,
        environmentOverride: 'production',
      }),
    )
    .then(credentials => {
      prod = credentials;
    })
    .then(() => executeCommand(`cf target -s Staging`))
    .then(() =>
      openSSHTunnel({
        sshIdNumber: 1,
        mongoPort: 1,
        environmentOverride: 'staging',
      }),
    )
    .then(credentials => {
      staging = credentials;
      return writeProdToStagingTmuxinator();
    })
    .catch((...errors) => {
      console.log('Production to Staging DB error', ...errors);
    });

main();
