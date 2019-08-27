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
    // Store the queryname for reuse later
    if (!this.queryName) {
      this.queryName = queryName;
    }
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

    const data = BaseResultCacher.fetchData({ query, countCursor }); // this.fetchData is not a function
    this.storeData({ cacheId, data, hash });

    return data;
  }

  invalidateCache(cacheId) {
    delete this.store[cacheId];
  }

  cacheExists(cacheId) {
    return !!this.store[cacheId];
  }

  setCache(cacheId, cacheData) {
    this.store[cacheId] = cacheData;
  }

  findAndInvalidateCache(params) {
    const cacheId = this.generateQueryId(this.queryName, params);
    if (this.cacheExists(cacheId)) {
      this.invalidateCache(cacheId);
    }
  }

  storeData({ cacheId, data, hash }) {
    const ttl = this.config.ttl || DEFAULT_TTL;
    this.setCache(cacheId, { data: cloneDeep(data), hash });

    Meteor.setTimeout(() => {
      this.invalidateCache(cacheId);
    }, ttl);
  }
}
