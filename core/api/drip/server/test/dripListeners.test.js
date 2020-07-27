import { Random } from 'meteor/random';

import { expect } from 'chai';
import sinon from 'sinon';

import {
  checkEmails,
  resetDatabase,
  waitForStub,
} from '../../../../utils/testHelpers';
import NoOpAnalytics from '../../../analytics/server/NoOpAnalytics';
import generator from '../../../factories/server';
import { ddpWithUserId } from '../../../methods/methodHelpers';
import { PROMOTION_STATUS } from '../../../promotions/promotionConstants';
import { PROPERTY_CATEGORY } from '../../../properties/propertyConstants';
import {
  adminCreateUser,
  anonymousCreateUser,
  assignAdminToUser,
  changeEmail,
  proInviteUser,
  setRole,
  setUserStatus,
  userVerifyEmail,
} from '../../../users/methodDefinitions';
import UserService from '../../../users/server/UserService';
import { ROLES, USER_STATUS } from '../../../users/userConstants';
import { DRIP_ACTIONS, DRIP_TAGS } from '../../dripConstants';
import { DripService } from '../DripService';

const SUBSCRIBER_EMAIL = `subscriber-${Random.id()}@e-potek.ch`;
const SUBSCRIBER_FIRSTNAME = 'Tom';
const SUBSCRIBER_LASTNAME = 'Sawyer';
const SUBSCRIBER_PHONE = '+41 123456';

// In this test suite, all Drip API calls are stubbed
// because they are tested in DripService.test.js
describe('dripListeners', function () {
  this.timeout(5000);
  let analyticsSpy;
  let callDripAPIStub;

  beforeEach(() => {
    resetDatabase();
    analyticsSpy = sinon.spy(NoOpAnalytics.prototype, 'track');
    callDripAPIStub = sinon.stub(DripService.prototype, 'callDripAPI');
    callDripAPIStub.resolves({});
    generator({
      organisations: { _id: 'org', name: 'Organisation' },
      properties: { _id: 'prop', category: PROPERTY_CATEGORY.PRO },
      promotions: {
        _id: 'promo',
        name: 'Promotion',
        status: PROMOTION_STATUS.OPEN,
        assignedEmployeeId: 'admin',
        promotionLots: { _id: 'pLot' },
      },
      users: [
        {
          _id: 'dev',
          _factory: 'dev',
        },
        {
          _id: 'admin',
          _factory: 'advisor',
          emails: [{ address: 'lydia@e-potek.ch', verified: true }],
          firstName: 'Lydia',
          lastName: 'Abraha',
        },
        {
          _id: 'pro1',
          _factory: 'pro',
          assignedEmployee: { _id: 'admin' },
          organisations: {
            _id: 'org',
            name: 'Organisation',
            $metadata: { isMain: true },
          },
          proProperties: {
            _id: 'prop',
            $metadata: { permissions: { canInviteCustomers: true } },
          },
          promotions: {
            _id: 'promo',
            $metadata: { permissions: { canInviteCustomers: true } },
          },
        },
      ],
    });
  });

  afterEach(() => {
    analyticsSpy.restore();
    callDripAPIStub.restore();
  });

  describe('proInviteUser', () => {
    const userToInvite = {
      email: SUBSCRIBER_EMAIL,
      firstName: SUBSCRIBER_FIRSTNAME,
      lastName: SUBSCRIBER_LASTNAME,
      phoneNumber: SUBSCRIBER_PHONE,
    };

    const expectedParams = {
      email: SUBSCRIBER_EMAIL,
      first_name: SUBSCRIBER_FIRSTNAME,
      last_name: SUBSCRIBER_LASTNAME,
      phone: SUBSCRIBER_PHONE,
      tags: ['referral_pro', 'test'],
      custom_fields: {
        assigneeEmailAddress: 'lydia@e-potek.ch',
        assigneeName: 'Lydia Abraha',
        assigneeCalendlyLink: 'https://calendly.com/epotek-lydia',
        referringOrganisationName: 'Organisation',
        promotionName: undefined,
      },
    };

    it('creates the subscriber to refer only', async () => {
      let userId;
      await ddpWithUserId('pro1', () =>
        proInviteUser.run({ user: userToInvite }).then(({ userId: id }) => {
          userId = id;
        }),
      );

      const [[method, params]] = await waitForStub(callDripAPIStub);

      expect(method).to.equal('createUpdateSubscriber');
      expect(params).to.deep.include({ ...expectedParams, user_id: userId });

      await checkEmails(2, { noExpect: true });
    });

    it('creates the subscriber invited to a pro property', async () => {
      let userId;
      await ddpWithUserId('pro1', () =>
        proInviteUser
          .run({ user: userToInvite, properties: ['prop'] })
          .then(({ userId: id }) => {
            userId = id;
          }),
      );

      const [[method, params]] = await waitForStub(callDripAPIStub);

      expect(method).to.equal('createUpdateSubscriber');
      expect(params).to.deep.include({ ...expectedParams, user_id: userId });
      await checkEmails(2, { noExpect: true });
    });

    it('creates the subscriber invited to a promotion', async () => {
      let userId;
      await ddpWithUserId('pro1', () =>
        proInviteUser
          .run({
            user: { ...userToInvite, promotionLotIds: ['pLot'] },
            promotionIds: ['promo'],
          })
          .then(({ userId: id }) => {
            userId = id;
          }),
      );

      const [[method, params]] = await waitForStub(callDripAPIStub);

      expect(method).to.equal('createUpdateSubscriber');
      expect(params).to.deep.include({
        ...expectedParams,
        user_id: userId,
        tags: ['referral_pro', 'test', 'promo'],
        custom_fields: {
          ...expectedParams.custom_fields,
          promotionName: 'Promotion',
        },
      });
      await checkEmails(2, { noExpect: true });
    });

    it('records the event', async () => {
      await ddpWithUserId('pro1', () =>
        proInviteUser.run({ user: userToInvite }),
      );

      const dripAPIStubArgs = await waitForStub(callDripAPIStub, 2);

      const [[method, params]] = dripAPIStubArgs.slice(-1);

      expect(method).to.equal('recordEvent');
      expect(params).to.deep.include({
        email: SUBSCRIBER_EMAIL,
        action: DRIP_ACTIONS.USER_CREATED,
        properties: undefined,
      });
      await checkEmails(2, { noExpect: true });
    });

    it('tracks the events in analytics', async () => {
      let userId;
      await ddpWithUserId('pro1', () =>
        proInviteUser.run({ user: userToInvite }).then(({ userId: id }) => {
          userId = id;
        }),
      );

      await waitForStub(callDripAPIStub, 2);
      const analyticsArgs = await waitForStub(analyticsSpy, 4);

      const dripAnalyticsArgs = analyticsArgs.slice(-2).map(args => args[0]);
      const subscriberCreatedEvent = dripAnalyticsArgs.find(
        ({ event }) => event === 'Drip Subscriber Created',
      );
      const eventRecordedEvent = dripAnalyticsArgs.find(
        ({ event }) => event === 'Drip Subscriber Event Recorded',
      );
      expect(subscriberCreatedEvent).to.deep.include({
        userId,
        event: 'Drip Subscriber Created',
      });
      expect(eventRecordedEvent).to.deep.include({
        userId,
        event: 'Drip Subscriber Event Recorded',
      });
      await checkEmails(2, { noExpect: true });
    });
  });

  describe('anonymousCreateUser', () => {
    const user = {
      email: SUBSCRIBER_EMAIL,
      firstName: SUBSCRIBER_FIRSTNAME,
      lastName: SUBSCRIBER_LASTNAME,
      phoneNumber: SUBSCRIBER_PHONE,
    };

    const expectedParams = {
      email: SUBSCRIBER_EMAIL,
      first_name: SUBSCRIBER_FIRSTNAME,
      last_name: SUBSCRIBER_LASTNAME,
      phone: SUBSCRIBER_PHONE,
      tags: ['organic', 'test'],
      custom_fields: {
        assigneeEmailAddress: 'lydia@e-potek.ch',
        assigneeName: 'Lydia Abraha',
        assigneeCalendlyLink: 'https://calendly.com/epotek-lydia',
        referringOrganisationName: undefined,
        promotionName: undefined,
      },
    };

    it('creates the organic subscriber', async () => {
      const userId = await anonymousCreateUser.run({ user });

      const [[method, params]] = await waitForStub(callDripAPIStub);

      expect(method).to.equal('createUpdateSubscriber');
      expect(params).to.deep.include({
        ...expectedParams,
        user_id: userId,
      });
    });

    it('creates the referral organic subscriber', async () => {
      const userId = await anonymousCreateUser.run({ user, referralId: 'org' });

      const [[method, params]] = await waitForStub(callDripAPIStub);

      expect(method).to.equal('createUpdateSubscriber');
      expect(params).to.deep.include({
        ...expectedParams,
        user_id: userId,
        tags: ['referral_organic', 'test'],
        custom_fields: {
          ...expectedParams.custom_fields,
          referringOrganisationName: 'Organisation',
        },
      });
    });

    it('records the event', async () => {
      await anonymousCreateUser.run({ user });

      const dripAPIStubArgs = await waitForStub(callDripAPIStub, 2);

      const [[method, params]] = dripAPIStubArgs.slice(-1);

      expect(method).to.equal('recordEvent');
      expect(params).to.deep.include({
        email: SUBSCRIBER_EMAIL,
        action: DRIP_ACTIONS.USER_CREATED,
        properties: undefined,
      });
    });

    it('tracks the events in analytics', async () => {
      const userId = await anonymousCreateUser.run({ user });

      await waitForStub(callDripAPIStub, 2);
      const analyticsArgs = await waitForStub(analyticsSpy, 3);

      const dripAnalyticsArgs = analyticsArgs.slice(-2).map(args => args[0]);
      const subscriberCreatedEvent = dripAnalyticsArgs.find(
        ({ event }) => event === 'Drip Subscriber Created',
      );
      const eventRecordedEvent = dripAnalyticsArgs.find(
        ({ event }) => event === 'Drip Subscriber Event Recorded',
      );
      expect(subscriberCreatedEvent).to.deep.include({
        userId,
        event: 'Drip Subscriber Created',
      });
      expect(eventRecordedEvent).to.deep.include({
        userId,
        event: 'Drip Subscriber Event Recorded',
      });
    });
  });

  describe('adminCreateUser', () => {
    const userToInvite = {
      email: SUBSCRIBER_EMAIL,
      firstName: SUBSCRIBER_FIRSTNAME,
      lastName: SUBSCRIBER_LASTNAME,
      phoneNumbers: [SUBSCRIBER_PHONE],
      role: ROLES.USER,
    };

    const expectedParams = {
      email: SUBSCRIBER_EMAIL,
      first_name: SUBSCRIBER_FIRSTNAME,
      last_name: SUBSCRIBER_LASTNAME,
      phone: SUBSCRIBER_PHONE,
      custom_fields: {
        assigneeEmailAddress: 'lydia@e-potek.ch',
        assigneeName: 'Lydia Abraha',
        assigneeCalendlyLink: 'https://calendly.com/epotek-lydia',
        referringOrganisationName: undefined,
        promotionName: undefined,
      },
    };

    it('does nothing if status is QUALIFIED', async () => {
      await ddpWithUserId('admin', () =>
        adminCreateUser.run({
          user: { ...userToInvite, status: USER_STATUS.QUALIFIED },
        }),
      );

      try {
        await waitForStub(callDripAPIStub);
        expect(1).to.equal(2, 'Should throw');
      } catch (error) {
        expect(error.message).to.include('timeout');
      }
    });

    it('creates the subscriber if its status is PROSPECT', async () => {
      let userId;
      await ddpWithUserId('admin', () =>
        adminCreateUser
          .run({
            user: {
              ...userToInvite,
              status: USER_STATUS.PROSPECT,
            },
          })
          .then(id => {
            userId = id;
          }),
      );

      const [[method, params]] = await waitForStub(callDripAPIStub);

      expect(method).to.equal('createUpdateSubscriber');
      expect(params).to.deep.include({ ...expectedParams, user_id: userId });
    });

    it('records the event', async () => {
      await ddpWithUserId('admin', () =>
        adminCreateUser.run({
          user: {
            ...userToInvite,
            status: USER_STATUS.PROSPECT,
          },
        }),
      );

      const dripAPIStubArgs = await waitForStub(callDripAPIStub, 2);

      const [[method, params]] = dripAPIStubArgs.slice(-1);

      expect(method).to.equal('recordEvent');
      expect(params).to.deep.include({
        email: SUBSCRIBER_EMAIL,
        action: DRIP_ACTIONS.USER_CREATED,
        properties: undefined,
      });
    });

    it('tracks the events in analytics', async () => {
      let userId;
      await ddpWithUserId('admin', () =>
        adminCreateUser
          .run({
            user: {
              ...userToInvite,
              status: USER_STATUS.PROSPECT,
            },
          })
          .then(id => {
            userId = id;
          }),
      );

      await waitForStub(callDripAPIStub, 2);
      const analyticsArgs = await waitForStub(analyticsSpy, 4);

      const dripAnalyticsArgs = analyticsArgs.slice(-2).map(args => args[0]);
      const subscriberCreatedEvent = dripAnalyticsArgs.find(
        ({ event }) => event === 'Drip Subscriber Created',
      );
      const eventRecordedEvent = dripAnalyticsArgs.find(
        ({ event }) => event === 'Drip Subscriber Event Recorded',
      );
      expect(subscriberCreatedEvent).to.deep.include({
        userId,
        event: 'Drip Subscriber Created',
      });
      expect(eventRecordedEvent).to.deep.include({
        userId,
        event: 'Drip Subscriber Event Recorded',
      });
    });
  });

  describe('userVerifyEmail', () => {
    const userId = Random.id();
    beforeEach(() => {
      generator({
        users: {
          _id: userId,
          emails: [{ address: SUBSCRIBER_EMAIL, verified: true }],
          firstName: SUBSCRIBER_FIRSTNAME,
          lastName: SUBSCRIBER_LASTNAME,
          phoneNumbers: [SUBSCRIBER_PHONE],
        },
      });
    });

    it('updates the subscriber', async () => {
      await ddpWithUserId(userId, () => userVerifyEmail.run({}));

      const [[method, params]] = await waitForStub(callDripAPIStub);

      expect(method).to.equal('createUpdateSubscriber');
      expect(params).to.deep.include({
        email: SUBSCRIBER_EMAIL,
        first_name: SUBSCRIBER_FIRSTNAME,
        last_name: SUBSCRIBER_LASTNAME,
        phone: SUBSCRIBER_PHONE,
      });
    });

    it('records the event', async () => {
      await ddpWithUserId(userId, () => userVerifyEmail.run({}));

      const dripAPIStubArgs = await waitForStub(callDripAPIStub, 2);

      const [[method, params]] = dripAPIStubArgs.slice(-1);

      expect(method).to.equal('recordEvent');
      expect(params).to.deep.include({
        email: SUBSCRIBER_EMAIL,
        action: DRIP_ACTIONS.USER_VALIDATED,
        properties: undefined,
      });
    });

    it('tracks the events in analytics', async () => {
      await ddpWithUserId(userId, () => userVerifyEmail.run({}));

      await waitForStub(callDripAPIStub);
      const analyticsArgs = await waitForStub(analyticsSpy, 2);

      const dripAnalyticsArgs = analyticsArgs.slice(-2).map(args => args[0]);
      const subscriberUpdatedEvent = dripAnalyticsArgs.find(
        ({ event }) => event === 'Drip Subscriber Updated',
      );
      const eventRecordedEvent = dripAnalyticsArgs.find(
        ({ event }) => event === 'Drip Subscriber Event Recorded',
      );
      expect(eventRecordedEvent).to.deep.include({
        userId,
        event: 'Drip Subscriber Event Recorded',
      });
      expect(subscriberUpdatedEvent).to.deep.include({
        userId,
        event: 'Drip Subscriber Updated',
      });
    });
  });

  // Called before removing user with a hook
  describe('remove user', () => {
    const userId = Random.id();
    beforeEach(() => {
      generator({
        users: {
          _id: userId,
          emails: [{ address: SUBSCRIBER_EMAIL, verified: true }],
          firstName: SUBSCRIBER_FIRSTNAME,
          lastName: SUBSCRIBER_LASTNAME,
          phoneNumbers: [SUBSCRIBER_PHONE],
        },
      });
    });

    it('removes the subscriber', async () => {
      UserService.remove({ userId });

      const [[method, params]] = await waitForStub(callDripAPIStub);

      expect(method).to.equal('deleteSubscriber');
      expect(params).to.equal(SUBSCRIBER_EMAIL);
    });
  });

  describe('setRole', () => {
    const userId = Random.id();

    beforeEach(() => {
      generator({
        users: {
          _id: userId,
          emails: [{ address: SUBSCRIBER_EMAIL, verified: true }],
          firstName: SUBSCRIBER_FIRSTNAME,
          lastName: SUBSCRIBER_LASTNAME,
          phoneNumbers: [SUBSCRIBER_PHONE],
        },
      });
    });

    it('does nothing if role is USER', async () => {
      await ddpWithUserId('dev', () =>
        setRole.run({ userId, role: ROLES.USER }),
      );

      try {
        await waitForStub(callDripAPIStub);
        expect(1).to.equal(2, 'should throw');
      } catch (error) {
        expect(error.message).to.include('timeout');
      }
    });

    it('removes the subscriber', async () => {
      await ddpWithUserId('dev', () =>
        setRole.run({ userId, role: ROLES.PRO }),
      );

      const [[method, params]] = await waitForStub(callDripAPIStub);

      expect(method).to.equal('deleteSubscriber');
      expect(params).to.equal(SUBSCRIBER_EMAIL);
    });

    it('tracks the event in analytics', async () => {
      await ddpWithUserId('dev', () =>
        setRole.run({ userId, role: ROLES.PRO }),
      );
      await waitForStub(callDripAPIStub);
      const [analyticsArgs] = await waitForStub(analyticsSpy);

      expect(analyticsArgs[0]).to.deep.include({
        userId,
        event: 'Drip Subscriber Removed',
      });
    });
  });

  describe('changeEmail', () => {
    const userId = Random.id();

    beforeEach(() => {
      generator({
        users: {
          _id: userId,
          emails: [{ address: SUBSCRIBER_EMAIL, verified: true }],
          firstName: SUBSCRIBER_FIRSTNAME,
          lastName: SUBSCRIBER_LASTNAME,
          phoneNumbers: [SUBSCRIBER_PHONE],
        },
      });
    });

    it('updates the subscriber', async () => {
      await ddpWithUserId('dev', () =>
        changeEmail.run({
          userId,
          newEmail: 'subscriber+new@e-potek.ch',
        }),
      );

      const dripAPIStubArgs = await waitForStub(callDripAPIStub, 2);
      const [[method, params]] = dripAPIStubArgs.slice(-1);

      expect(method).to.equal('createUpdateSubscriber');
      expect(params).to.deep.include({ email: 'subscriber+new@e-potek.ch' });
    });

    it('creates the subscriber if it did not exist', async () => {
      callDripAPIStub.callsFake(method => {
        // Simulate fetch error
        if (method === 'fetchSubscriber') {
          throw new Error('user not found');
        }

        return Promise.resolve({});
      });

      await ddpWithUserId('dev', () =>
        changeEmail.run({
          userId,
          newEmail: 'subscriber+new@e-potek.ch',
        }),
      );

      const dripAPIStubArgs = await waitForStub(callDripAPIStub, 3);
      const [createSubscriberArgs, recordEventArgs] = dripAPIStubArgs.slice(-2);

      expect(createSubscriberArgs[0]).to.equal('createUpdateSubscriber');
      expect(createSubscriberArgs[1]).to.deep.include({
        email: 'subscriber+new@e-potek.ch',
      });
      expect(recordEventArgs[0]).to.equal('recordEvent');
      expect(recordEventArgs[1]).to.deep.include({
        email: 'subscriber+new@e-potek.ch',
        action: DRIP_ACTIONS.USER_CREATED,
        properties: undefined,
      });
    });
  });

  describe('assignAdminToUser', () => {
    const userId = Random.id();

    beforeEach(() => {
      generator({
        users: [
          {
            _id: 'admin2',
            _factory: 'advisor',
            emails: [{ address: 'elise@e-potek.ch', verified: true }],
            firstName: 'Elise',
            lastName: 'Juanola',
          },
          {
            _id: userId,
            emails: [{ address: SUBSCRIBER_EMAIL, verified: true }],
            firstName: SUBSCRIBER_FIRSTNAME,
            lastName: SUBSCRIBER_LASTNAME,
            phoneNumbers: [SUBSCRIBER_PHONE],
          },
        ],
      });
    });

    it('updates the subscriber', async () => {
      await ddpWithUserId('dev', () =>
        assignAdminToUser.run({ userId, adminId: 'admin2' }),
      );

      const [[method, params]] = await waitForStub(callDripAPIStub);

      expect(method).to.equal('createUpdateSubscriber');
      expect(params).to.deep.include({
        email: SUBSCRIBER_EMAIL,
        custom_fields: {
          assigneeEmailAddress: 'elise@e-potek.ch',
          assigneeName: 'Elise Juanola',
          assigneeCalendlyLink: 'https://calendly.com/epotek-elise',
        },
      });
    });

    it('tracks the event in analytics', async () => {
      await ddpWithUserId('dev', () =>
        assignAdminToUser.run({ userId, adminId: 'admin2' }),
      );

      await waitForStub(callDripAPIStub);
      const analyticsArgs = await waitForStub(analyticsSpy);

      const [dripAnalyticsArgs] = analyticsArgs.slice(-1).map(args => args[0]);
      expect(dripAnalyticsArgs).to.deep.include({
        userId,
        event: 'Drip Subscriber Updated',
      });
    });
  });

  describe('setUserStatus', () => {
    const userId = Random.id();

    beforeEach(() => {
      generator({
        users: {
          _id: userId,
          emails: [{ address: SUBSCRIBER_EMAIL, verified: true }],
          firstName: SUBSCRIBER_FIRSTNAME,
          lastName: SUBSCRIBER_LASTNAME,
          phoneNumbers: [SUBSCRIBER_PHONE],
        },
      });
    });

    it('records the event when status is QUALIFIED', async () => {
      await ddpWithUserId('admin', () =>
        setUserStatus.run({ userId, status: USER_STATUS.QUALIFIED }),
      );

      const [[method, params]] = await waitForStub(callDripAPIStub);

      expect(method).to.equal('recordEvent');
      expect(params).to.deep.include({
        email: SUBSCRIBER_EMAIL,
        action: DRIP_ACTIONS.USER_QUALIFIED,
        properties: undefined,
      });
    });

    it('tracks the events in analytics when status is QUALIFIED', async () => {
      await ddpWithUserId('admin', () =>
        setUserStatus.run({ userId, status: USER_STATUS.QUALIFIED }),
      );

      await waitForStub(callDripAPIStub);
      const [analyticsArgs] = await waitForStub(analyticsSpy);

      expect(analyticsArgs[0]).to.deep.include({
        userId,
        event: 'Drip Subscriber Event Recorded',
      });
    });

    it('tags the subscriber to LOST when status is LOST', async () => {
      await ddpWithUserId('admin', () =>
        setUserStatus.run({ userId, status: USER_STATUS.LOST }),
      );

      const [[method, params]] = await waitForStub(callDripAPIStub);

      expect(method).to.equal('tagSubscriber');
      expect(params).to.deep.include({
        email: SUBSCRIBER_EMAIL,
        tag: DRIP_TAGS.LOST,
      });
    });

    it('tracks the events in analytics when status is LOST', async () => {
      await ddpWithUserId('admin', () =>
        setUserStatus.run({ userId, status: USER_STATUS.QUALIFIED }),
      );

      await waitForStub(callDripAPIStub);
      const [analyticsArgs] = await waitForStub(analyticsSpy);

      expect(analyticsArgs[0]).to.deep.include({
        userId,
        event: 'Drip Subscriber Event Recorded',
      });
    });
  });
});
