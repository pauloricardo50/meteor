import { ROLES } from 'core/api/constants';
import { getMixpanelAuthorization } from '../../api';

const MIXPANEL_URL = 'https://mixpanel.com/api/2.0/';

class MixpanelService {
  getData({ url, method = 'GET', body, headers }) {
    return getMixpanelAuthorization
      .run({})
      .then(Authorization =>
        fetch(url, { method, headers: { Authorization, ...headers }, body }))
      .then(result => result.json())
      .catch((error) => {
        throw error;
      });
  }

  buildUrl({ params, endpoint = 'segmentation' }) {
    const url = MIXPANEL_URL + endpoint + this.createQuery(params);
    return url;
  }

  createQuery(params) {
    return params
      ? `?${Object.keys(params)
        .map(param =>
          `${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`)
        .join('&')}`
      : '';
  }

  getEventsByUserId(userId) {
    this.getData({
      url: this.buildUrl({
        params: { distinct_ids: `["${userId}"]` },
        endpoint: 'stream/query',
      }),
    });
  }

  formatBody(body) {
    return Object.keys(body)
      .filter(key => body[key])
      .map((key) => {
        const value = body[key];
        const stringified = typeof value === 'string' ? value : JSON.stringify(value);
        const bodyPart = encodeURI(stringified);
        return `${key}=${bodyPart}`;
      })
      .join('&');
  }

  getLastSeen({ role, userId }) {
    const cohorts = {
      [ROLES.PRO]: 320151,
      [ROLES.USER]: 320144,
    };

    const body = {
      project_id: 1269868,
      sort_key: 'properties["$last_seen"]',
      sort_order: 'descending',
      search: userId,
      output_properties: [
        '$email',
        'first_name',
        '$last_name',
        'last_name',
        '$name',
        'name',
        'id',
        '$last_seen',
      ],
      filter_by_cohort: role && { id: cohorts[role] },
      limit: 10,
      include_all_users: false,
    };

    return this.getData({
      method: 'POST',
      body: this.formatBody(body),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      url: this.buildUrl({ endpoint: 'engage' }),
    }).then(result => result.results);
  }
}

export default new MixpanelService();
