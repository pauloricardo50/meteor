import MixpanelExport from 'mixpanel-data-export';

const API_KEY = '47c4e11846a6cd795a275ccf9535035a';
const API_SECRET = '7f8e74ff4fe0f850373abb114ca9ec91';
const MIXPANEL_URL = `https://mixpanel.com/api/2.0/`;

export const createQuery = params =>
    params
        ? `?${Object.keys(params)
            .map(
                param =>
                    `${encodeURIComponent(param)}=${encodeURIComponent(
                        params[param]
                    )}`
            )
            .join('&')}`
        : '';

const buildUrl = ({ params, endpoint = 'segmentation' }) => {
    const url = MIXPANEL_URL + endpoint + createQuery(params);
    return url;
};

const getData = url =>
    fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Basic ${btoa(`${API_SECRET}:${API_KEY}`)}`
        }
    })
        .then(result => result.json())
        .catch(error => {
            console.log('Mixpanel fetch error:', error);
            throw error;
        });

const getEventsByUserId = userId =>
    getData(
        buildUrl({
            params: {
                distinct_ids: `["${userId}"]`
            },
            endpoint: 'stream/query'
        })
    );

export default getEventsByUserId;
