/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';

import { expect } from 'chai';

import { checkEmails, resetDatabase } from '../../../../../utils/testHelpers';
import generator from '../../../../factories/server';
import { PROMOTION_STATUS } from '../../../../promotions/promotionConstants';
import PromotionService from '../../../../promotions/server/PromotionService';
import UserService from '../../../../users/server/UserService';
import { ROLES } from '../../../../users/userConstants';
import RESTAPI from '../../RESTAPI';
import { HTTP_STATUS_CODES } from '../../restApiConstants';
import {
  fetchAndCheckResponse,
  getTimestampAndNonce,
  makeHeaders,
} from '../../test/apiTestHelpers.test';
import inviteUserToPromotion from '../inviteUserToPromotion';

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

describe('REST: inviteUserToPromotion', function () {
  this.timeout(10000);

  before(function () {
    api.start();
  });

  after(() => {
    api.reset();
  });

  beforeEach(() => {
    resetDatabase();
    generator({
      users: [
        {
          _id: 'pro',
          _factory: ROLES.PRO,
          organisations: {
            _id: 'org',
            name: 'org',
            $metadata: { isMain: true },
          },
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
        },
        { _factory: ROLES.ADVISOR },
      ],
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

    const invitedUser = UserService.getByEmail(userToInvite.email, {
      referredByUserLink: 1,
      referredByOrganisationLink: 1,
      loans: { shareSolvency: 1 },
    });

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

    const invitedUser = UserService.getByEmail(userToInvite.email, {
      referredByUserLink: 1,
      referredByOrganisationLink: 1,
      loans: { shareSolvency: 1 },
    });

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

    const invitedUser = UserService.getByEmail(userToInvite.email, {
      referredByUserLink: 1,
      referredByOrganisationLink: 1,
      loans: { shareSolvency: 1, activities: { title: 1, description: 1 } },
      activities: { description: 1, title: 1 },
    });

    expect(invitedUser.loans[0].shareSolvency).to.equal(true);

    const { activities: customerActivities = [] } = invitedUser;
    const { activities: loanActivities = [] } = invitedUser.loans?.[0] || {};

    let activities = [...customerActivities, ...loanActivities];
    let intervalCount = 0;

    activities = await new Promise((resolve, reject) => {
      const interval = Meteor.setInterval(() => {
        if (activities.length === 0 && intervalCount < 10) {
          const { loans, activities: userActs = [] } = UserService.getByEmail(
            invitedUser.email,
            {
              loans: { shareSolvency: 1, activities: { description: 1 } },
              activities: { description: 1 },
            },
          );

          const { activities: loanActs = [] } = loans?.[0] || {};

          activities = [...userActs, ...loanActs];

          intervalCount++;
        } else {
          Meteor.clearInterval(interval);
          if (intervalCount >= 10) {
            reject('Fetch activities timeout');
          }
          resolve(activities);
        }
      }, 100);
    });

    expect(activities.length).to.equal(3);
    expect(activities[0].description).to.contain('TestFirstName TestLastName');
    expect(activities[0].description).to.contain('testNote');
    expect(activities[1].title).to.contain('Dossier créé');
    expect(activities[2].description).to.contain('TestNote');

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
