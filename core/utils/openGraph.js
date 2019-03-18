import ogs from 'open-graph-scraper';

export const getOpenGraphMeta = (url) => {
  console.log('getOpenGraphMeta url:', url);
  const options = { url, timeout: 4000 };
  try {
    return ogs(options)
      .then((results) => {
        console.log('OG results:', results.data);
        return results.data;
      })
      .catch((error) => {
        console.log('OG error:', error);
      });
  } catch (err) {
    console.log('OGGG err:', err);
  }

  return Promise.resolve();
};
