// @flow
const TEST_TIMEOUT = 2000;
const INTERVAL = 50;

const pollUntilReady = (isReadyFunc: () => boolean) =>
  new Promise((resolve, reject) => {
    let count = 0;
    const poll = setInterval(() => {
      const isReady = isReadyFunc();
      const hasTimedOut = count > TEST_TIMEOUT / INTERVAL;

      if (isReady) {
        clearInterval(poll);
        resolve();
      } else if (hasTimedOut) {
        clearInterval(poll);
        reject();
      }

      count += 1;
    }, INTERVAL);
  });

export default pollUntilReady;
