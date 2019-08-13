import { MICROSERVICE_PORTS } from '../../constants';
import Process from '../Process';

const path = require('path');

const [microservice, ...args] = process.argv.slice(2);

const port = MICROSERVICE_PORTS[microservice];

const ngrok = new Process();

ngrok.spawn({
  command: './ngrok.sh',
  args: [port],
  options: {
    cwd: path.resolve(__dirname, '../../../'),
    stdio: 'inherit',
  },
});
