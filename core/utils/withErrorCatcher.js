import { lifecycle } from 'recompose';

import { logError } from '../api/slack/methodDefinitions';

const withErrorCatcher = lifecycle({
  componentDidMount() {
    if (!window) {
      return;
    }

    window.onerror = (msg, url, lineNo, columnNo, error) => {
      const { Kadira } = window;
      if (Kadira && Kadira.trackError) {
        Kadira.trackError('react', error.stack.toString());
      }
      logError.run({
        error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
        additionalData: ['JS error', msg],
        url: window && window.location && window.location.href,
      });
    };
  },
});

export default withErrorCatcher;
