import { Meteor } from 'meteor/meteor';
import https from 'https';
import queryString from 'query-string';

const CRONITOR_URL = 'https://cronitor.io';
const ACTIONS = {
  RUN: 'run',
  COMPLETE: 'complete',
  PAUSE: 'pause',
  FAIL: 'fail',
};
const REQ_TIMEOUT = 10000;

export default class CronitorService {
  constructor({ id, authKey }) {
    this.id = id;
    this.authKey = authKey;
    this.baseUrl = CRONITOR_URL;
  }

  run = () => {
    const urlObj = this.buildUrlObj({ action: ACTIONS.RUN });
    const url = this.buildUrl({ urlObj });
    return this.getWithTimeout({ url });
  };

  complete = (msg) => {
    const urlObj = this.buildUrlObj({ action: ACTIONS.COMPLETE });
    if (msg) {
      if (!urlObj.qs) {
        urlObj.qs = {};
      }

      urlObj.qs.msg = JSON.stringify(msg);
    }
    const url = this.buildUrl({ urlObj });
    return this.getWithTimeout({ url });
  };

  pause = (hours) => {
    const urlObj = this.buildUrlObj({ action: ACTIONS.PAUSE });
    urlObj.basePath = `${urlObj.basePath}/${hours}`;
    const url = this.buildUrl({ urlObj });
    return this.getWithTimeout({ url });
  };

  fail = (msg) => {
    const urlObj = this.buildUrlObj({ action: ACTIONS.FAIL });
    if (msg) {
      if (!urlObj.qs) {
        urlObj.qs = {};
      }

      if (msg.sanitizedError) {
        urlObj.qs.msg = JSON.stringify(msg.sanitizedError.message);
      } else {
        urlObj.qs.msg = JSON.stringify(msg);
      }
    }
    const url = this.buildUrl({ urlObj });
    return this.getWithTimeout({ url });
  };

  buildUrlObj = ({ action }) => {
    const urlObj = { basePath: `${this.baseUrl}/${this.id}/${action}` };
    if (this.authKey) {
      urlObj.qs = { auth_key: this.authKey };
    }

    return urlObj;
  };

  buildUrl = ({ urlObj }) =>
    urlObj.basePath + (urlObj.qs ? `?${queryString.stringify(urlObj.qs)}` : '');

  getWithTimeout = ({ url }) => {
    const promise = new Promise((resolve, reject) => {
      https
        .get(url, (response) => {
          let data = '';

          response.on('data', (chunk) => {
            data += chunk;
          });

          response.on('end', () => {
            resolve(data);
          });
        })
        .on('error', reject);
    });

    const timeout = new Promise((resolve, reject) => {
      const wait = Meteor.setTimeout(() => {
        Meteor.clearTimeout(wait);
        reject(new Meteor.Error('Timed out'));
      }, REQ_TIMEOUT);
    });

    return Promise.race([promise, timeout]);
  };
}
