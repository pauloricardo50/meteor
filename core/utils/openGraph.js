import ogs from 'open-graph-scraper';
import SlackService from 'core/api/slack/server/SlackService';

export const getOpenGraphMeta = (url) => {
  const options = { url, timeout: 4000 };
  return ogs(options)
    .then(results => results.data)
    .catch((error) => {
      SlackService.sendError({
        error,
        additionalData: ['getOpenGraphMeta error', url, options],
      });
    });
};
