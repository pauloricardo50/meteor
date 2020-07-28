import callMethod from './meteorClient/callMethod';

const handleError = (error, additionalData) => {
  const payload = {
    error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
    additionalData,
    url: window?.location?.href ? window.location.href : '',
  };
  callMethod('logError', payload);
};

const listenToErrors = () => {
  window.onerror = (msg, url, lineNo, columnNo, error) =>
    handleError(error, ['Gatsby JS error', msg]);

  window.addEventListener('unhandledrejection', ({ reason }) => {
    if (
      reason?.networkError?.result?.message?.includes(
        'Query does not pass validation',
      )
    ) {
      // Do nothing: https://github.com/prismicio/gatsby-source-prismic-graphql/issues/18
    } else {
      handleError(reason, ['Gatsby Promise error']);
    }
  });
};

export default listenToErrors;
