/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import { expect } from 'chai';
import fetch from 'node-fetch';
import NodeRSA from 'node-rsa';

import { PROMOTION_STATUS } from '../../../../constants';
import PromotionService from '../../../../promotions/server/PromotionService';
import UserService from '../../../../users/server/UserService';
import { sortObject } from '../../../../helpers';
import { HTTP_STATUS_CODES } from '../../restApiConstants';
import RESTAPI from '../../RESTAPI';
import inviteUserToPromotion from '../inviteUserToPromotion';

const API_PORT = process.env.CIRCLE_CI ? 3000 : 4106;

let user;
let keyPair;
let promotionId;
const userToInvite = {
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '1234',
};

const checkResponse = ({ res, expectedResponse, status = 200 }) =>
  res.json().then((body) => {
    expect(body).to.deep.equal(expectedResponse);
  });

const fetchAndCheckResponse = ({ url, data, expectedResponse, status }) =>
  fetch(`http://localhost:${API_PORT}/api${url}`, data).then(res =>
    checkResponse({ res, expectedResponse, status }));

const api = new RESTAPI();
api.addEndpoint('/inviteUserToPromotion', 'POST', inviteUserToPromotion);

const signBody = (body) => {
  const key = new NodeRSA();
  key.importKey(keyPair.privateKey, 'pkcs1-private-pem');

  const sortedBody = sortObject(body);

  const signature = key.sign(JSON.stringify(sortedBody), 'base64', 'utf8');
  return signature;
};

const inviteUser = ({ userData, expectedResponse, status, id }) => {
  const body = { promotionId: id || promotionId, user: userData };
  const filteredBody = Object.keys(body)
    .filter(key => !!body[key])
    .reduce((object, key) => ({ ...object, [key]: body[key] }), {});
  const signature = signBody(filteredBody);

  return fetchAndCheckResponse({
    url: '/inviteUserToPromotion',
    data: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keyPair.publicKey}`,
      },
      body: JSON.stringify({ ...filteredBody, signature }),
    },
    expectedResponse,
    status,
  });
};

const setupPromotion = () => {
  PromotionService.addProUser({ promotionId, userId: user._id });
  PromotionService.setUserPermissions({
    promotionId,
    userId: user._id,
    permissions: { canInviteCustomers: true },
  });
  PromotionService.update({
    promotionId,
    object: { status: PROMOTION_STATUS.OPEN },
  });
};

describe.only('REST: inviteUserToPromotion', function () {
  this.timeout(10000);

  before(function () {
    if (Meteor.settings.public.microservice !== 'pro') {
      this.parent.pending = true;
      this.skip();
    } else {
      api.start();
    }
  });

  after(() => {
    api.reset();
  });

  beforeEach(() => {
    resetDatabase();
    user = Factory.create('pro');
    keyPair = UserService.generateKeyPair({ userId: user._id });
    promotionId = Factory.create('promotion')._id;
  });

  it('invites a user to promotion', () => {
    setupPromotion();

    return inviteUser({
      userData: userToInvite,
      expectedResponse: {
        message: `Successfully invited user "${
          userToInvite.email
        }" to promotion id "${promotionId}"`,
      },
      status: HTTP_STATUS_CODES.OK,
    });
  });

  context('returns an error when', () => {
    it('promotion does not exist', () =>
      inviteUser({
        userData: userToInvite,
        expectedResponse: {
          status: 500,
          message:
            '[Could not find object with filters "{"_id":"12345"}" in collection "promotions"]',
        },
        id: '12345',
      }));

    it('user does not own the promotion', () =>
      inviteUser({
        userData: userToInvite,
        expectedResponse: {
          message:
            'Vous ne pouvez pas inviter des clients à cette promotion [NOT_AUTHORIZED]',
          status: 500,
        },
      }));

    it('user is not allowed to invite customers to the promotion', () => {
      PromotionService.addProUser({ promotionId, userId: user._id });
      PromotionService.setUserPermissions({
        promotionId,
        userId: user._id,
        permissions: { canInviteCustomers: false },
      });

      return inviteUser({
        userData: userToInvite,
        expectedResponse: {
          status: 500,
          message:
            'Vous ne pouvez pas inviter des clients à cette promotion [NOT_AUTHORIZED]',
        },
      });
    });

    it('promotion is not open', () => {
      PromotionService.addProUser({ promotionId, userId: user._id });
      PromotionService.setUserPermissions({
        promotionId,
        userId: user._id,
        permissions: { canInviteCustomers: true },
      });

      return inviteUser({
        userData: userToInvite,
        status: HTTP_STATUS_CODES.FORBIDDEN,
        expectedResponse: {
          status: 500,
          message:
            'Vous ne pouvez pas inviter des clients à cette promotion [NOT_AUTHORIZED]',
        },
      });
    });

    it('fails if the body is incorrect', () => {
      PromotionService.addProUser({ promotionId, userId: user._id });
      setupPromotion();

      promotionId = undefined;

      return inviteUser({
        userData: userToInvite,
        expectedResponse: {
          status: 500,
          message:
            'Match error: Expected string, got undefined in field promotionId',
        },
      });
    });

    it('user is already invited to promotion', () => {
      PromotionService.addProUser({ promotionId, userId: user._id });
      setupPromotion();

      return inviteUser({
        userData: userToInvite,
        expectedResponse: {
          message: `Successfully invited user "${
            userToInvite.email
          }" to promotion id "${promotionId}"`,
        },
      }).then(() =>
        inviteUser({
          userData: userToInvite,
          expectedResponse: {
            status: 500,
            message: '[Cet utilisateur est déjà invité à cette promotion]',
          },
        }));
    });
  });
});
