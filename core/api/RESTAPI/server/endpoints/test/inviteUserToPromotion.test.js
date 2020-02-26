/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';

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
import generator from '../../../../factories/server';
import { checkEmails } from '../../../../../utils/testHelpers';

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
    generator({
      users: {
        _id: 'pro',
        _factory: 'pro',
        organisations: { _id: 'org', name: 'org', $metadata: { isMain: true } },
      },
      promotions: {
        _id: 'promotionId',
        _factory: 'promotion',
        promotionLots: { _factory: 'promotionLot' },
      },
    });
    user = UserService.findOne('pro');
    promotionId = 'promotionId';
  });

  it('invites a user to promotion', async () => {
    setupPromotion();

    await inviteUser({
      userData: userToInvite,
      expectedResponse: {
        message: `Successfully invited user "${userToInvite.email}" to promotion id "${promotionId}"`,
      },
      status: HTTP_STATUS_CODES.OK,
    });

    const invitedUser = UserService.get(
      { 'emails.address': { $in: [userToInvite.email] } },
      {
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
        loans: { shareSolvency: 1 },
      },
    );

    expect(invitedUser.loans[0].shareSolvency).to.equal(undefined);

    await checkEmails(2);
  });

  it('invites a user to promotion with solvency sharing', async () => {
    setupPromotion();

    await inviteUser({
      userData: userToInvite,
      shareSolvency: true,
      expectedResponse: {
        message: `Successfully invited user "${userToInvite.email}" to promotion id "${promotionId}"`,
      },
      status: HTTP_STATUS_CODES.OK,
    });

    const invitedUser = UserService.get(
      { 'emails.address': { $in: [userToInvite.email] } },
      {
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
        loans: { shareSolvency: 1 },
      },
    );

    expect(invitedUser.loans[0].shareSolvency).to.equal(true);

    await checkEmails(2);
  });

  it('invites a user to promotion with invitation note', async () => {
    setupPromotion();

    await inviteUser({
      userData: userToInvite,
      shareSolvency: true,
      invitationNote: 'testNote',
      expectedResponse: {
        message: `Successfully invited user "${userToInvite.email}" to promotion id "${promotionId}"`,
      },
      status: HTTP_STATUS_CODES.OK,
    });

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

    tasks = await new Promise((resolve, reject) => {
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

    expect(tasks.length).to.equal(1);
    expect(tasks[0].description).to.contain('TestFirstName TestLastName');
    expect(tasks[0].description).to.contain('testNote');

    await checkEmails(2);
  });

  context('returns an error when', () => {
    it('promotion does not exist', async () => {
      await inviteUser({
        userData: userToInvite,
        expectedResponse: {
          status: 400,
          message:
            '[Could not find object with filters "{"_id":"12345"}" in collection "promotions"]',
        },
        id: '12345',
      });
    });

    it('user does not own the promotion', async () => {
      await inviteUser({
        userData: userToInvite,
        expectedResponse: {
          message:
            'Vous ne pouvez pas inviter des clients à cette promotion [NOT_AUTHORIZED]',
          status: 400,
        },
      });
    });

    it('user is not allowed to invite customers to the promotion', async () => {
      PromotionService.addProUser({ promotionId, userId: user._id });
      PromotionService.setUserPermissions({
        promotionId,
        userId: user._id,
        permissions: { canInviteCustomers: false },
      });

      await inviteUser({
        userData: userToInvite,
        expectedResponse: {
          status: 400,
          message:
            'Vous ne pouvez pas inviter des clients à cette promotion [NOT_AUTHORIZED]',
        },
      });
    });

    it('promotion is not open', async () => {
      PromotionService.addProUser({ promotionId, userId: user._id });
      PromotionService.setUserPermissions({
        promotionId,
        userId: user._id,
        permissions: { canInviteCustomers: true },
      });

      await inviteUser({
        userData: userToInvite,
        status: HTTP_STATUS_CODES.FORBIDDEN,
        expectedResponse: {
          status: 400,
          message:
            'Vous ne pouvez pas inviter des clients à cette promotion [NOT_AUTHORIZED]',
        },
      });
    });

    it('fails if the body is incorrect', async () => {
      PromotionService.addProUser({ promotionId, userId: user._id });
      setupPromotion();

      promotionId = undefined;

      await inviteUser({
        userData: userToInvite,
        expectedResponse: {
          status: 400,
          message: '[No promotionId provided]',
        },
      });
    });

    it('user is already invited to promotion', async () => {
      PromotionService.addProUser({ promotionId, userId: user._id });
      setupPromotion();

      await inviteUser({
        userData: userToInvite,
        expectedResponse: {
          message: `Successfully invited user "${userToInvite.email}" to promotion id "${promotionId}"`,
        },
      });

      await inviteUser({
        userData: userToInvite,
        expectedResponse: {
          status: HTTP_STATUS_CODES.CONFLICT,
          message: 'Ce client est déjà invité à cette promotion [409]',
        },
      });
    });
  });
});
