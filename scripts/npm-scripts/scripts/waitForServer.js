import http from 'http';

const initialRetries = 50;

const waitForServer = ({ retries = initialRetries, port, onError }, cb) => {
  const url = `http://localhost:${port}`;
  http
    .get(url, res => {
      res.on('data', () => {
        console.log('on data');
      });
      res.on('end', () => {
        console.log('on end');
        cb();
      });
    })
    .on('error', e => {
      if (retries > 0) {
        console.log('retrying', retries);
        setTimeout(
          () => waitForServer({ retries: --retries, port, onError }, cb),
          1000,
        );
      } else {
        console.log('errored out...');
        onError && onError();
        process.exit(1);
      }
    });
};

export default waitForServer;
