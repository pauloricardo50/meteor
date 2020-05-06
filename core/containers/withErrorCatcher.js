import { lifecycle } from 'recompose';

import { logError } from '../api/errorLogger/methodDefinitions';

const defaultHandleError = (error, additionalData) => {
  if (process.env.NODE_ENV === 'development') {
    // Error is fired twice, second time with an additionnal '_suppressLogging' property
    const errorPropertyNames = Object.getOwnPropertyNames(error) || [];
    if (errorPropertyNames.includes('_suppressLogging')) {
      return true;
    }
  }

  console.error(error);

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

  return true;
};

let hasAddedListeners = false;

const withErrorCatcher = lifecycle({
  componentDidMount() {
    if (!window || hasAddedListeners) {
      return;
    }

    const { handleError = defaultHandleError } = this.props;

    window.onerror = (msg, url, lineNo, columnNo, error) =>
      handleError(error, ['JS error', msg]);

    window.addEventListener('unhandledrejection', ({ reason }) =>
      handleError(reason, ['Promise error']),
    );

    hasAddedListeners = true;
  },
});

export default withErrorCatcher;
