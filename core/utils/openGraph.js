import ogs from 'open-graph-scraper';

import SlackService from '../api/slack/server/SlackService';

export const getOpenGraphMeta = url => {
  const options = { url, timeout: 4000 };
  return ogs(options)
    .then(results => results.data)
    .catch(error => {
      if (error) {
        SlackService.sendError({
          error,
          additionalData: ['getOpenGraphMeta error', url, options],
        });
      }
    });
};
