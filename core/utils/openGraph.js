import ogs from 'open-graph-scraper';

import { logError } from '../api/errorLogger/methodDefinitions';

export const getOpenGraphMeta = url => {
  const options = { url, timeout: 4000 };
  return ogs(options)
    .then(results => results.data)
    .catch(error => {
      if (error?.error !== 'Page Not Found') {
        // Ignore errors if the page has simply been removed from the web
        logError.run({
          error: new Error(error),
          additionalData: ['getOpenGraphMeta error', url, options],
        });
      }
    });
};
