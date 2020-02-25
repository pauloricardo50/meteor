import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import crypto from 'crypto';
import nodeFetch from 'node-fetch';
import queryString from 'query-string';

import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';
import { ddpWithUserId } from '../../methods/methodHelpers';
import { ERROR_CODES } from '../../errors';
import LoanService from '../../loans/server/LoanService';

const EPOTEK_IPS = ['213.3.47.70'];
const FRONT_AUTH_SECRET = Meteor.settings.front?.authSecret;
const FRONT_API_SECRET = Meteor.settings.front?.apiSecret;
const FRONT_API_TOKEN = Meteor.settings.front?.apiToken;
const API_PATH = 'https://api2.frontapp.com';
const LOANS_TAG_ID = 'tag_9hgg2';
export const LOANS_TAG_URL = `https://api2.frontapp.com/tags/${LOANS_TAG_ID}`;
const FRONT_WEBHOOK_ANALYTICS_USER_ID = 'front_webhook';

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
    makeEndpoint: ({ tagId }) => `/tags/${tagId}`,
  },
  listTagChildren: {
    method: 'GET',
    makeEndpoint: ({ parentTagId }) => `/tags/${parentTagId}/children`,
  },
  listTagConversations: {
    method: 'GET',
    makeEndpoint: ({ tagId, q, pageToken, limit }) => {
      const query = queryString.stringify({
        q,
        page_token: pageToken,
        limit,
      });

      return `/tags/${tagId}/conversations?${query}`;
    },
  },
  getConversation: {
    method: 'GET',
    makeEndpoint: ({ conversationId }) => `/conversations/${conversationId}`,
  },
};

const WEBHOOKS = {
  AUTO_TAG: 'auto-tag',
  TEST: 'test',
};

// always stub the API in tests
// const ENABLE_API = Meteor.isProduction;
const ENABLE_API = true;

export class FrontService {
  constructor({ fetch, isEnabled }) {
    this.isEnabled = isEnabled;
    this.fetch = fetch;
  }

  checkPluginAuthentication({
    body: { authSecret, email } = {},
    headers: { 'x-real-ip': realIp = '', 'x-forwarded-for': forwardedFor = '' },
  }) {
    let error;

    // Check IP
    if (
      !EPOTEK_IPS.some(ip => ip === realIp) &&
      !EPOTEK_IPS.some(ip =>
        forwardedFor.split(',').some(forwardedForIp => forwardedForIp === ip),
      )
    ) {
      error = new Meteor.Error(ERROR_CODES.UNAUTHORIZED, 'Wrong IP');
    }

    // Check Auth secret
    if (!authSecret || authSecret !== FRONT_AUTH_SECRET) {
      error = new Meteor.Error(ERROR_CODES.UNAUTHORIZED, 'Wrong auth secret');
    }

    const user =
      email &&
      UserService.get(
        { 'emails.0.address': email, roles: { $in: [ROLES.DEV, ROLES.ADMIN] } },
        { _id: 1 },
      );

    // Check user
    if (!user) {
      error = new Meteor.Error(ERROR_CODES.UNAUTHORIZED, 'Invalid user');
    }

    return { isAuthenticated: !error, user, error };
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
      user: { _id: FRONT_WEBHOOK_ANALYTICS_USER_ID },
    };
  }

  handleRequest({ user, body }) {
    const { type, params } = body;

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
      ...(body ? { body: JSON.stringify(body) } : {}),
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

  updateConversationTags({ conversation, tags = [], appendTags = true }) {
    const { id: conversationId, tags: currentTags = [] } = conversation;

    let newTags = tags;

    if (appendTags) {
      const currentTagIds = currentTags.map(({ id }) => id);
      newTags = [...currentTagIds, ...newTags];
    }

    return this.callFrontApi({
      endpoint: 'updateConversation',
      params: { conversationId },
      body: { tag_ids: newTags },
    });
  }

  async handleAutoTag({ conversation }) {
    if (!conversation) {
      return;
    }

    const { tags = [], recipient } = conversation;

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

    return this.updateConversationTags({ conversation, tags: [frontTagId] });
  }

  async tagLoan({ loanId, conversationId }) {
    const loan = LoanService.get(loanId, {
      frontTagId: 1,
      name: 1,
    });

    let { frontTagId } = loan;
    const { name: loanName } = loan;

    if (!frontTagId) {
      frontTagId = await this.getLoanTagId({ loanId, loanName });
    }

    const conversation = await this.callFrontApi({
      endpoint: 'getConversation',
      params: { conversationId },
    });

    return this.updateConversationTags({ conversation, tags: [frontTagId] });
  }

  async untagLoan({ loanId, conversationId }) {
    const { frontTagId } = LoanService.get(loanId, {
      frontTagId: 1,
    });

    if (!frontTagId) {
      return;
    }

    const conversation = await this.callFrontApi({
      endpoint: 'getConversation',
      params: { conversationId },
    });

    const { tags: currentTags = [] } = conversation;
    const currentTagIds = currentTags.map(({ id }) => id);
    const newTags = currentTagIds.filter(tag => tag !== frontTagId);

    return this.updateConversationTags({
      conversation,
      tags: newTags,
      appendTags: false,
    });
  }
}

export default new FrontService({ fetch: nodeFetch, isEnabled: ENABLE_API });
