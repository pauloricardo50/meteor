import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import crypto from 'crypto';
import nodeFetch from 'node-fetch';

import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';
import { ddpWithUserId } from '../../methods/methodHelpers';
import { ERROR_CODES } from '../../errors';
import LoanService from '../../loans/server/LoanService';

const FRONT_AUTH_SECRET = Meteor.settings.front?.authSecret;
const FRONT_API_SECRET = Meteor.settings.front?.apiSecret;
const FRONT_API_TOKEN = Meteor.settings.front?.apiToken;
const API_PATH = 'https://api2.frontapp.com';
const LOANS_TAG_ID = 'tag_9hgg2';
export const LOANS_TAG_URL = `https://api2.frontapp.com/tags/${LOANS_TAG_ID}`;

const frontEndpoints = {
  updateConversation: {
    method: 'PATCH',
    makeEndpoint: ({ conversationId }) => `/conversations/${conversationId}`,
  },
  identity: {
    method: 'GET',
    makeEndpoint: () => '/me',
  },
  createChildTag: {
    method: 'POST',
    makeEndpoint: ({ parentTagId }) => `/tags/${parentTagId}/children`,
  },
  deleteTag: {
    method: 'DELETE',
    makeEndpoint: ({ tagId }) => `https://api2.frontapp.com/tags/${tagId}`,
  },
  listTagChildren: {
    method: 'GET',
    makeEndpoint: ({ parentTagId }) =>
      `https://api2.frontapp.com/tags/${parentTagId}/children`,
  },
  listTagConversations: {
    method: 'GET',
    makeEndpoint: ({ tagId, q, pageToken, limit }) => {
      const url = new URL(
        `https://api2.frontapp.com/tags/${tagId}/conversations`,
      );

      if (q) {
        url.searchParams.append('q', q);
      }

      if (pageToken) {
        url.searchParams.append('page_token', pageToken);
      }

      if (limit) {
        url.searchParams.append('limit', limit);
      }

      return url.href;
    },
  },
};

const WEBHOOKS = {
  AUTO_TAG: 'auto-tag',
  TEST: 'test',
};

// always stub the API in tests
const ENABLE_API = Meteor.isProduction;

export class FrontService {
  constructor({ fetch, isEnabled }) {
    this.isEnabled = isEnabled;
    this.fetch = fetch;
  }

  checkPluginAuthentication({ body: { authSecret, email } = {} }) {
    if (!authSecret || authSecret !== FRONT_AUTH_SECRET) {
      throw new Meteor.Error(ERROR_CODES.UNAUTHORIZED, 'Authentication failed');
    }

    const user =
      email &&
      UserService.get(
        { 'emails.0.address': email, roles: { $in: [ROLES.DEV, ROLES.ADMIN] } },
        { _id: 1 },
      );

    return { isAuthenticated: !!user, user };
  }

  validateFrontSignature(data, signature) {
    const hash = crypto
      .createHmac('sha1', FRONT_API_SECRET)
      .update(JSON.stringify(data))
      .digest('base64');

    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  }

  checkWebhookAuthentication(req) {
    const signature = req.headers['x-front-signature'];
    const data = req.body;

    const isValid = this.validateFrontSignature(data, signature);

    return {
      isAuthenticated: isValid,
      error:
        !isValid &&
        new Meteor.Error(
          ERROR_CODES.UNAUTHORIZED,
          'Front signature verification failed',
        ),
    };
  }

  handleRequest(body) {
    const { type, params, user } = body;

    if (type === 'QUERY_ONE' || type === 'QUERY') {
      return this.handleQuery({ user, type, ...params });
    }

    if (type === 'METHOD') {
      return this.handleMethod({ user, ...params });
    }

    throw new Error(`Unknown Front App API type "${type}"`);
  }

  handleQuery({ collectionName, type, query }) {
    const collection = Mongo.Collection.get(collectionName);

    if (type === 'QUERY_ONE') {
      return collection.createQuery(query).fetchOne();
    }

    if (type === 'QUERY') {
      return collection.createQuery(query).fetch();
    }

    throw new Error(`Front query type must be QUERY_ONE or QUERY: "${type}"`);
  }

  handleMethod({ user: { _id }, methodName, ...params }) {
    return new Promise((resolve, reject) => {
      ddpWithUserId(_id, () => {
        Meteor.call(methodName, params[0], (error, result) => {
          if (error) {
            reject(error);
          }

          resolve(result);
        });
      });
    });
  }

  handleWebhook({ body, webhookName }) {
    if (webhookName === WEBHOOKS.AUTO_TAG) {
      return this.handleAutoTag(body);
    }

    if (webhookName === WEBHOOKS.TEST) {
      return this.callFrontApi({ endpoint: 'identity' });
    }

    throw new Meteor.Error(`Unknown Front webhookName "${webhookName}"`);
  }

  handleFetch(...args) {
    // Do this to easily stub fetch in tests
    return this.fetch(...args);
  }

  callFrontApi({ endpoint, params, body }) {
    const endpointConfig = frontEndpoints[endpoint];

    if (!endpointConfig) {
      throw new Error(`Invalid endpoint config ${endpoint}`);
    }

    const { method, makeEndpoint } = endpointConfig;

    const path = API_PATH + makeEndpoint(params);

    if (!this.isEnabled) {
      console.log("Would've called Front API", endpoint);
      console.log('params:', params);
      console.log('body:', body);

      return Promise.resolve({});
    }

    return this.handleFetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${FRONT_API_TOKEN}`,
      },
      body: body && JSON.stringify(body),
    })
      .then(result => result.json())
      .then(result => {
        console.log('callFrontApi result:', endpoint);
        console.log('params:', params);
        console.log('result:', result);
        return result;
      })
      .catch(error => {
        console.log('FrontApi error:', error);
        throw error;
      });
  }

  createLoanTag({ loanName }) {
    return this.callFrontApi({
      endpoint: 'createChildTag',
      params: { parentTagId: LOANS_TAG_ID },
      body: { name: loanName },
    });
  }

  listTagChildren({ parentTagId }) {
    return this.callFrontApi({
      endpoint: 'listTagChildren',
      params: { parentTagId },
    });
  }

  listTagConversations(params) {
    return this.callFrontApi({
      endpoint: 'listTagConversations',
      params,
    });
  }

  deleteTag(params) {
    return this.callFrontApi({
      endpoint: 'deleteTag',
      params,
    });
  }

  async getLoanTagId({ loanId, loanName }) {
    const { _results = [] } = await this.listTagChildren({
      parentTagId: LOANS_TAG_ID,
    });

    const foundTag = _results.find(({ name }) => name.includes(loanName));
    let frontTagId;

    if (foundTag) {
      frontTagId = foundTag.id;
    } else {
      const { id } = await this.createLoanTag({ loanName });
      frontTagId = id;
    }

    LoanService.update({ loanId, object: { frontTagId } });

    return frontTagId;
  }

  async handleAutoTag({ conversation }) {
    if (!conversation) {
      return;
    }

    const { id: conversationId, tags = [], recipient } = conversation;

    const hasLoanTag = tags.find(
      ({ _links }) => _links?.related?.parent_tag === LOANS_TAG_URL,
    );

    if (hasLoanTag) {
      // Don't tag if there is already a loan tag
      return;
    }

    const email = recipient.role === 'from' && recipient.handle;
    const recipientUser =
      email &&
      UserService.get(
        { 'emails.0.address': email, roles: ROLES.USER },
        { loans: { name: 1, frontTagId: 1 } },
      );

    if (!recipientUser) {
      // If the user is not found in our DB
      return;
    }

    if (recipientUser.loans?.length !== 1) {
      // Only automatically tag the conversation if there is a single loan on the user
      return;
    }

    const [loan] = recipientUser.loans;
    let { frontTagId } = loan;

    if (!loan.frontTagId) {
      frontTagId = await this.getLoanTagId({
        loanId: loan._id,
        loanName: loan.name,
      });
    }

    const currentTagIds = tags.map(({ id }) => id);

    return this.callFrontApi({
      endpoint: 'updateConversation',
      params: { conversationId },
      body: { tag_ids: [...currentTagIds, frontTagId] },
    });
  }
}

export default new FrontService({ fetch: nodeFetch, isEnabled: ENABLE_API });
