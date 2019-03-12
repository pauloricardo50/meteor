import { Meteor } from 'meteor/meteor';
import { BaseResultCacher } from 'meteor/cultofcoders:grapher';
import { EJSON } from 'meteor/ejson';
import hashObject from 'object-hash';

const cloneDeep = require('lodash/cloneDeep');

const DEFAULT_TTL = 1000 * 60 * 60; // 1 hour

export default class QueryCacher extends BaseResultCacher {
  constructor(config = {}) {
    super(config);
    this.store = {};
  }

  generateQueryId(queryName, params) {
    return `${queryName}::${EJSON.stringify(params)}`;
  }

  getHash(cacheId) {
    const params = EJSON.parse(cacheId.split('::')[1]);
    const { getDataToHash = () => null } = this.config;

    const dataToHash = getDataToHash(params);
    return hashObject.MD5(dataToHash);
  }

  fetch(cacheId, { query, countCursor }) {
    const cacheData = this.store[cacheId];
    const hash = this.getHash(cacheId);

    if (cacheData !== undefined) {
      const { hash: cachedHash, data } = cacheData;

      if (hash === cachedHash) {
        return cloneDeep(data);
      }
    }

    const data = BaseResultCacher.fetchData({ query, countCursor });
    this.storeData({ cacheId, data, hash });

    return data;
  }

  storeData({ cacheId, data, hash }) {
    const ttl = this.config.ttl || DEFAULT_TTL;
    this.store[cacheId] = { data: cloneDeep(data), hash };

    Meteor.setTimeout(() => {
      delete this.store[cacheId];
    }, ttl);
  }
}
