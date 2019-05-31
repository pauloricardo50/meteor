import { lifecycle } from 'recompose';

import { logError } from '../api/slack/methodDefinitions';

const handleError = (error, additionalData) => {
  const { Kadira } = window;
  if (Kadira && Kadira.trackError) {
    Kadira.trackError('react', error.stack.toString());
  }

  logError.run({
    error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
    additionalData,
    url:
      window && window.location && window.location.href
        ? window.location.href
        : '',
  });
};

let hasAddedListeners = false;

const withErrorCatcher = lifecycle({
  componentDidMount() {
    if (!window || hasAddedListeners) {
      return;
    }

    window.onerror = (msg, url, lineNo, columnNo, error) =>
      handleError(error, ['JS error', msg]);

    window.addEventListener('unhandledrejection', ({ reason }) =>
      handleError(reason, ['Promise error']));

    hasAddedListeners = true;
  },
});

export default withErrorCatcher;
