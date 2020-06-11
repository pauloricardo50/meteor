import ogs from 'open-graph-scraper';

import { logError } from '../api/errorLogger/methodDefinitions';

export const getOpenGraphMeta = url => {
  const options = { url, timeout: 4000 };
  return ogs(options)
    .then(results => results.data)
    .catch(error => {
      if (error) {
        logError.run({
          error,
          additionalData: ['getOpenGraphMeta error', url, options],
        });
      }
    });
};
