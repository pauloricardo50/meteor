import meteorClient from './meteorClient';

const handleError = (error, additionalData) => {
  console.error('errorListener error:');
  console.error(error);
  meteorClient.call('logError', {
    error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
    additionalData,
    url: window?.location?.href ? window.location.href : '',
  });
};

const listenToErrors = () => {
  window.onerror = (msg, url, lineNo, columnNo, error) =>
    handleError(error, ['Gatsby JS error', msg]);

  window.addEventListener('unhandledrejection', ({ reason }) =>
    handleError(reason, ['Gatsby Promise error']),
  );
};

export default listenToErrors;
