import http from 'http';

const initialRetries = 200;
let called = false; // Do this to avoid race conditions where the callback is called multiple times very quickly

const waitForServer = ({ retries = initialRetries, port, onError }, cb) => {
  const url = `http://localhost:${port}`;
  const request = http
    .get(url, res => {
      res.on('data', () => {});
      res.on('end', () => {
        if (!called) {
          called = true;
          cb();
        }
      });
    })
    .on('error', e => {
      if (retries > 0) {
        setTimeout(
          () => waitForServer({ retries: --retries, port, onError }, cb),
          1000,
        );
      } else {
        onError && onError();
        process.exit(1);
      }
    });

  // When polling the gatsby website, this http.get gets stuck and takes 20 seconds to succeed
  // even when the website is already live. This avoids that
  request.setTimeout(1000, () => {
    waitForServer({ retries: --retries, port, onError }, cb);
  });
};

export default waitForServer;
