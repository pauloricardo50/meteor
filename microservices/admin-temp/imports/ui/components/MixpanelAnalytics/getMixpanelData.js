import { getMixpanelAuthorization } from 'core/api';

const MIXPANEL_URL = 'https://mixpanel.com/api/2.0/';

export const createQuery = params =>
  (params
    ? `?${Object.keys(params)
      .map(param =>
        `${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`)
      .join('&')}`
    : '');

const buildUrl = ({ params, endpoint = 'segmentation' }) => {
  const url = MIXPANEL_URL + endpoint + createQuery(params);
  return url;
};

const getData = url =>
  getMixpanelAuthorization
    .run()
    .then(Authorization =>
      fetch(url, { method: 'GET', headers: { Authorization } }))
    .then(result => result.json())
    .catch((error) => {
      console.log('Mixpanel fetch error:', error);
      throw error;
    });

const getEventsByUserId = userId =>
  getData(buildUrl({
    params: {
      distinct_ids: `["${userId}"]`,
    },
    endpoint: 'stream/query',
  }));

export default getEventsByUserId;
