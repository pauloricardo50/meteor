// @flow
const TEST_TIMEOUT = 2000;
const INTERVAL = 50;

const pollUntilReady = (
  isReadyFunc: (() => boolean) | (() => Promise<boolean>),
  interval: number = INTERVAL,
  timeout: number = TEST_TIMEOUT,
) =>
  new Promise((resolve, reject) => {
    let count = 0;
    let poll;

    const handleIsReady = (isReady) => {
      const hasTimedOut = count > timeout / interval;

      if (isReady) {
        clearInterval(poll);
        resolve(isReady);
      } else if (hasTimedOut) {
        clearInterval(poll);
        reject();
      }

      count += 1;
    };

    poll = setInterval(() => {
      if (isReadyFunc.then) {
        return isReadyFunc()
          .then(handleIsReady)
          .catch(reject);
      }

      handleIsReady(isReadyFunc());
    }, interval);
  });

export default pollUntilReady;
