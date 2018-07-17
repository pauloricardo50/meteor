// @flow
const TEST_TIMEOUT = 2000;
const INTERVAL = 50;

const pollUntilReady = (
  isReadyFunc: (() => boolean) | (() => Promise<boolean>),
  interval: number = INTERVAL,
) =>
  new Promise((resolve, reject) => {
    let count = 0;
    let poll;

    const handleIsReady = (isReady) => {
      const hasTimedOut = count > TEST_TIMEOUT / interval;

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
