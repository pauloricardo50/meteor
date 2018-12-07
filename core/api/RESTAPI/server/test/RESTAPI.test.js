/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import fetch from 'node-fetch';
import startAPI from '..';
import { Factory } from 'meteor/dburles:factory';
import {
  DOCUMENT_USER_PERMISSIONS,
  PROMOTION_STATUS,
} from 'core/api/constants';
import PromotionService from 'imports/core/api/promotions/PromotionService';
import omit from 'lodash/omit';
import { REST_API_ERRORS, HTTP_STATUS_CODES } from '../constants';

describe('RESTAPI', () => {
  before(function () {
    if (Meteor.settings.public.microservice !== 'pro') {
      this.parent.pending = true;
      this.skip();
    }
  });

  const API_PORT = process.env.CIRCLE_CI ? 3000 : 4106;

  const userToInvite = {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '1234',
  };
  let user;
  let apiToken;
  let promotionId;
  const api = startAPI();
  const responseData = req => ({
    statusCode: HTTP_STATUS_CODES.OK,
    body: {
      message: 'Test',
      userId: req.user && req.user._id,
    },
  });

  api.connectHandlers({
    method: 'POST',
    path: '/api/test',
    handler: (req, res) =>
      api.sendResponse({
        res,
        data: responseData(req),
      }),
  });

  beforeEach(() => {
    resetDatabase();
    apiToken = Random.id(24);
    user = Factory.create('user', { apiToken });
    promotionId = Factory.create('promotion')._id;
  });

  const checkResponse = ({ res, expectedResponse }) => {
    expect(res.status).to.equal(expectedResponse.statusCode);
    return res
      .json()
      .then(body => expect(body).to.deep.equal(expectedResponse.body));
  };

  const fetchAndCheckResponse = ({ url, data, expectedResponse }) =>
    fetch(url, data).then(res =>
      checkResponse({
        res,
        expectedResponse,
      }));

  context('returns an error when', () => {
    it('endpoint path is unknown', () =>
      fetchAndCheckResponse({
        url: `http://localhost:${API_PORT}/api/unknown_endpoint`,
        data: { method: 'POST' },
        expectedResponse: REST_API_ERRORS.UNKNOWN_ENDPOINT({
          path: '/api/unknown_endpoint',
          method: 'POST',
        }),
      }));

    it('endpoint method is unknown', () =>
      fetchAndCheckResponse({
        url: `http://localhost:${API_PORT}/api/test`,
        data: { method: 'GET' },
        expectedResponse: REST_API_ERRORS.UNKNOWN_ENDPOINT({
          path: '/api/test',
          method: 'GET',
        }),
      }));

    it('content type is wrong', () =>
      fetchAndCheckResponse({
        url: `http://localhost:${API_PORT}/api/test`,
        data: {
          method: 'POST',
          headers: { 'Content-Type': 'plain/text' },
        },
        expectedResponse: REST_API_ERRORS.WRONG_CONTENT_TYPE('plain/text'),
      }));

    it('authorization type is wrong', () =>
      fetchAndCheckResponse({
        url: `http://localhost:${API_PORT}/api/test`,
        data: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        expectedResponse: REST_API_ERRORS.WRONG_AUTHORIZATION_TYPE,
      }));

    it('token is wrong', () =>
      fetchAndCheckResponse({
        url: `http://localhost:${API_PORT}/api/test`,
        data: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer 12345',
          },
        },
        expectedResponse: REST_API_ERRORS.AUTHORIZATION_FAILED,
      }));
  });

  it('can authenticate', () =>
    fetchAndCheckResponse({
      url: `http://localhost:${API_PORT}/api/test`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.apiToken}`,
        },
      },
      expectedResponse: responseData({ user }),
    }));

  it('receive a response', () => {
    const expectedResponse = {
      statusCode: HTTP_STATUS_CODES.OK,
      body: { message: 'Test2' },
    };
    api.connectHandlers({
      method: 'GET',
      path: '/api/test2',
      handler: (req, res) =>
        api.sendResponse({
          res,
          data: expectedResponse,
        }),
    });

    return fetchAndCheckResponse({
      url: `http://localhost:${API_PORT}/api/test2`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.apiToken}`,
        },
      },
      expectedResponse,
    });
  });

  context('inviteUserToPromotion', () => {
    const inviteUserToPromotion = ({ userData, expectedResponse, id }) =>
      fetchAndCheckResponse({
        url: `http://localhost:${API_PORT}/api/inviteUserToPromotion`,
        data: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.apiToken}`,
          },
          body: JSON.stringify({
            promotionId: id || promotionId,
            user: userData,
          }),
        },
        expectedResponse,
      });

    const inviteUserMissingKey = ({ userData, keyToOmit }) =>
      inviteUserToPromotion({
        userData: omit(userData, keyToOmit),
        expectedResponse: REST_API_ERRORS.MISSING_KEY({
          key: keyToOmit,
          object: 'user',
        }),
      });

    context('returns an error when', () => {
      it('promotion does not exist', () =>
        inviteUserToPromotion({
          userData: userToInvite,
          expectedResponse: REST_API_ERRORS.PROMOTION_NOT_FOUND('12345'),
          id: '12345',
        }));

      it('user does not own the promotion', () =>
        inviteUserToPromotion({
          userData: userToInvite,
          expectedResponse: REST_API_ERRORS.NOT_ALLOWED_TO_MODIFY_PROMOTION,
        }));

      it('user is not allowed to modify the promotion', () => {
        PromotionService.addProUser({ promotionId, userId: user._id });
        PromotionService.setUserPermissions({
          promotionId,
          userId: user._id,
          permissions: DOCUMENT_USER_PERMISSIONS.READ,
        });

        return inviteUserToPromotion({
          userData: userToInvite,
          expectedResponse: REST_API_ERRORS.NOT_ALLOWED_TO_MODIFY_PROMOTION,
        });
      });

      it('promotion is not open', () => {
        PromotionService.addProUser({ promotionId, userId: user._id });
        PromotionService.setUserPermissions({
          promotionId,
          userId: user._id,
          permissions: DOCUMENT_USER_PERMISSIONS.MODIFY,
        });

        return inviteUserToPromotion({
          userData: userToInvite,
          expectedResponse: {
            statusCode: HTTP_STATUS_CODES.FORBIDDEN,
            body: {
              message:
                "[Vous ne pouvez pas inviter de clients lorsque la promotion n'est pas en vente, contactez-nous pour valider la promotion.]",
            },
          },
        });
      });
      it('user is missing informations', () => {
        PromotionService.addProUser({ promotionId, userId: user._id });
        PromotionService.setUserPermissions({
          promotionId,
          userId: user._id,
          permissions: DOCUMENT_USER_PERMISSIONS.MODIFY,
        });
        PromotionService.update({
          promotionId,
          object: { status: PROMOTION_STATUS.OPEN },
        });

        return inviteUserMissingKey({
          userData: userToInvite,
          keyToOmit: 'email',
        })
          .then(() =>
            inviteUserMissingKey({
              userData: userToInvite,
              keyToOmit: 'firstName',
            }))
          .then(() =>
            inviteUserMissingKey({
              userData: userToInvite,
              keyToOmit: 'lastName',
            }))
          .then(() =>
            inviteUserMissingKey({
              userData: userToInvite,
              keyToOmit: 'phoneNumber',
            }));
      });

      it('user is already invited to promotion', () => {
        PromotionService.addProUser({ promotionId, userId: user._id });
        PromotionService.setUserPermissions({
          promotionId,
          userId: user._id,
          permissions: DOCUMENT_USER_PERMISSIONS.MODIFY,
        });
        PromotionService.update({
          promotionId,
          object: { status: PROMOTION_STATUS.OPEN },
        });

        const expectedResponse = {
          statusCode: HTTP_STATUS_CODES.OK,
          body: {
            message: `Invited user ${
              userToInvite.email
            } to promotion id ${promotionId}`,
          },
        };

        return inviteUserToPromotion({
          userData: userToInvite,
          expectedResponse,
        }).then(() =>
          inviteUserToPromotion({
            userData: userToInvite,
            expectedResponse: {
              statusCode: HTTP_STATUS_CODES.FORBIDDEN,
              body: {
                message: '[Cet utilisateur est déjà invité à cette promotion]',
              },
            },
          }));
      });
    });

    it('invites user to promotion', () => {
      PromotionService.addProUser({ promotionId, userId: user._id });
      PromotionService.setUserPermissions({
        promotionId,
        userId: user._id,
        permissions: DOCUMENT_USER_PERMISSIONS.MODIFY,
      });
      PromotionService.update({
        promotionId,
        object: { status: PROMOTION_STATUS.OPEN },
      });

      const expectedResponse = {
        statusCode: HTTP_STATUS_CODES.OK,
        body: {
          message: `Invited user ${
            userToInvite.email
          } to promotion id ${promotionId}`,
        },
      };

      return inviteUserToPromotion({
        userData: userToInvite,
        expectedResponse,
      });
    });
  });
});
