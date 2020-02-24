import { HTTP_STATUS_CODES } from '../../../core/api/RESTAPI/server/restApiConstants';

const { Front } = window;

class EpotekFrontApi {
  constructor() {
    this.init();
  }

  init() {
    this.authSecret = Front.qs.auth_secret;
  }

  getEpotekEndpoint() {
    const pluginEndpoint = Front.endpoint;
    const [apiEndpoint] = pluginEndpoint.split('/files');
    return `${apiEndpoint}/api/front-plugin`;
  }

  makeRequest({ type, params }) {
    const body = {
      authSecret: this.authSecret,
      email: Front.user.email,
      type,
      params,
    };

    return fetch(this.getEpotekEndpoint(), {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(result => result.json())
      .then(result => {
        const { status, message, errorName, info } = result;
        if (
          status &&
          typeof status === 'number' &&
          status !== HTTP_STATUS_CODES.OK
        ) {
          throw new Error(info || message, errorName);
        }

        return result;
      });
  }

  query(collectionName, query) {
    return this.makeRequest({
      type: 'QUERY',
      params: { collectionName, query },
    });
  }

  queryOne(collectionName, query) {
    return this.makeRequest({
      type: 'QUERY_ONE',
      params: { collectionName, query },
    });
  }

  callMethod(methodName, ...params) {
    return this.makeRequest({
      type: 'METHOD',
      params: { methodName, ...params },
    });
  }
}

export default new EpotekFrontApi();
