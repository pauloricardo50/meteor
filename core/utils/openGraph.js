import ogs from 'open-graph-scraper';

export const getOpenGraphMeta = (url) => {
  const options = { url, timeout: 4000 };
  return ogs(options).then(results => results.data);
};
