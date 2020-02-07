/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { expect } from 'chai';

import PromotionLotService from 'core/api/promotionLots/server/PromotionLotService';
import { PROMOTION_STATUS } from '../../../../constants';
import PromotionService from '../../../../promotions/server/PromotionService';
import UserService from '../../../../users/server/UserService';
import { HTTP_STATUS_CODES } from '../../restApiConstants';
import RESTAPI from '../../RESTAPI';
import inviteUserToPromotion from '../inviteUserToPromotion';
import {
  fetchAndCheckResponse,
  makeHeaders,
  getTimestampAndNonce,
} from '../../test/apiTestHelpers.test';

let user;
let promotionId;
const userToInvite = {
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '+41 22 566 01 10',
};

const api = new RESTAPI();
api.addEndpoint(
  '/promotions/:promotionId/invite-customer',
  'POST',
  inviteUserToPromotion,
  { rsaAuth: true, endpointName: 'Invite customer to promotion' },
);

const inviteUser = ({
  userData,
  expectedResponse,
  status,
  id,
  shareSolvency = undefined,
  invitationNote,
}) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  const body = { user: userData, shareSolvency, invitationNote };
  return fetchAndCheckResponse({
    url: `/promotions/${id || promotionId}/invite-customer`,
    data: {
      method: 'POST',
      headers: makeHeaders({
        userId: user._id,
        timestamp,
        nonce,
        body,
      }),
      body: JSON.stringify(body),
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

describe('REST: inviteUserToPromotion', function() {
  this.timeout(10000);

  before(function() {
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
    const promotionLotId = Factory.create('promotionLot')._id;
    promotionId = Factory.create('promotion', {
      promotionLotLinks: [{ _id: promotionLotId }],
    })._id;
  });

  it('invites a user to promotion', () => {
    setupPromotion();

    return inviteUser({
      userData: userToInvite,
      expectedResponse: {
        message: `Successfully invited user "${userToInvite.email}" to promotion id "${promotionId}"`,
      },
      status: HTTP_STATUS_CODES.OK,
    }).then(() => {
      const invitedUser = UserService.get(
        { 'emails.address': { $in: [userToInvite.email] } },
        {
          referredByUserLink: 1,
          referredByOrganisationLink: 1,
          loans: { shareSolvency: 1 },
        },
      );

      expect(invitedUser.loans[0].shareSolvency).to.equal(undefined);
    });
  });

  it('invites a user to promotion with solvency sharing', () => {
    setupPromotion();

    return inviteUser({
      userData: userToInvite,
      shareSolvency: true,
      expectedResponse: {
        message: `Successfully invited user "${userToInvite.email}" to promotion id "${promotionId}"`,
      },
      status: HTTP_STATUS_CODES.OK,
    }).then(() => {
      const invitedUser = UserService.get(
        { 'emails.address': { $in: [userToInvite.email] } },
        {
          referredByUserLink: 1,
          referredByOrganisationLink: 1,
          loans: { shareSolvency: 1 },
        },
      );

      expect(invitedUser.loans[0].shareSolvency).to.equal(true);
    });
  });

  it('invites a user to promotion with invitation note', () => {
    setupPromotion();

    return inviteUser({
      userData: userToInvite,
      shareSolvency: true,
      invitationNote: 'testNote',
      expectedResponse: {
        message: `Successfully invited user "${userToInvite.email}" to promotion id "${promotionId}"`,
      },
      status: HTTP_STATUS_CODES.OK,
    })
      .then(() => {
        const invitedUser = UserService.get(
          { 'emails.address': { $in: [userToInvite.email] } },
          {
            referredByUserLink: 1,
            referredByOrganisationLink: 1,
            loans: { shareSolvency: 1 },
            tasks: { description: 1 },
          },
        );

        expect(invitedUser.loans[0].shareSolvency).to.equal(true);

        let { tasks = [] } = invitedUser;
        let intervalCount = 0;

        return new Promise((resolve, reject) => {
          const interval = Meteor.setInterval(() => {
            if (tasks.length === 0 && intervalCount < 10) {
              tasks =
                UserService.get(
                  {
                    'emails.address': { $in: [userToInvite.email] },
                  },
                  {
                    tasks: { description: 1 },
                  },
                ).tasks || [];
              intervalCount++;
            } else {
              Meteor.clearInterval(interval);
              if (intervalCount >= 10) {
                reject('Fetch tasks timeout');
              }
              resolve(tasks);
            }
          }, 100);
        });
      })
      .then(tasks => {
        expect(tasks.length).to.equal(1);
        expect(tasks[0].description).to.contain('TestFirstName TestLastName');
        expect(tasks[0].description).to.contain('testNote');
      });
  });

  context('returns an error when', () => {
    it('promotion does not exist', () =>
      inviteUser({
        userData: userToInvite,
        expectedResponse: {
          status: 400,
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
          status: 400,
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
          status: 400,
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
          status: 400,
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
          status: 400,
          message: '[No promotionId provided]',
        },
      });
    });

    it('user is already invited to promotion', () => {
      PromotionService.addProUser({ promotionId, userId: user._id });
      setupPromotion();

      return inviteUser({
        userData: userToInvite,
        expectedResponse: {
          message: `Successfully invited user "${userToInvite.email}" to promotion id "${promotionId}"`,
        },
      }).then(() =>
        inviteUser({
          userData: userToInvite,
          expectedResponse: {
            status: HTTP_STATUS_CODES.CONFLICT,
            message: 'Ce client est déjà invité à cette promotion [409]',
          },
        }),
      );
    });
  });
});
