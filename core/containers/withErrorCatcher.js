import { Meteor } from 'meteor/meteor';

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

  const { Monti } = window;
  if (Monti && Monti.trackError) {
    Monti.trackError('react', error.message, {
      stacks: error.stack.toString(),
    });
  }

  if (Meteor.isTest) {
    return;
  }

  logError.run({
    error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
    additionalData,
    url: window?.location?.href ? window.location.href : '',
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
