import { expect } from 'chai';
import sinon from 'sinon';

import { resetDatabase } from '../../../../utils/testHelpers';
import NoOpAnalytics from '../../../analytics/server/NoOpAnalytics';
import ErrorLogger from '../../../errorLogger/server/ErrorLogger';
import generator from '../../../factories/server';
import UserService from '../../../users/server/UserService';
import {
  ACQUISITION_CHANNELS,
  USER_STATUS,
} from '../../../users/userConstants';
import { DRIP_ACTIONS, DRIP_TAGS } from '../../dripConstants';
import DripService from '../DripService';

const SUBSCRIBER_EMAIL = 'subscriber@e-potek.ch';
const SUBSCRIBER_ID = 'subscriber';
const SUBSCRIBER_FIRSTNAME = 'Subscriber';
const SUBSCRIBER_LASTNAME = 'E-Potek';
const SUBSCRIBER_PHONE = '+41 123456';

const removeSubscriber = () =>
  DripService.removeSubscriber({ email: SUBSCRIBER_EMAIL });

describe.only('DripService', function () {
  this.timeout(10000);
  let logErrorSpy;
  let analyticsSpy;

  beforeEach(() => {
    resetDatabase();
    logErrorSpy = sinon.spy(ErrorLogger, 'logError');
    analyticsSpy = sinon.spy(NoOpAnalytics.prototype, 'track');
    generator({
      users: [
        {
          _id: 'admin',
          firstName: 'Lydia',
          lastName: 'Abraha',
          _factory: 'advisor',
          emails: [{ address: 'lydia@e-potek.ch', verified: true }],
        },
        {
          _id: SUBSCRIBER_ID,
          emails: [{ address: SUBSCRIBER_EMAIL, verified: true }],
          firstName: SUBSCRIBER_FIRSTNAME,
          lastName: SUBSCRIBER_LASTNAME,
          phoneNumbers: [SUBSCRIBER_PHONE],
          assignedEmployee: { _id: 'admin' },
          referredByOrganisation: { name: 'Organisation' },
          loans: { promotions: { name: 'Promotion' } },
        },
      ],
    });
  });

  afterEach(() => {
    logErrorSpy.restore();
    analyticsSpy.restore();
  });

  context('createSubscriber', () => {
    it('throws if user is not found', async () => {
      await UserService.remove({ userId: SUBSCRIBER_ID });
      try {
        await DripService.createSubscriber({ email: SUBSCRIBER_EMAIL });
        expect(1).to.equal(2, 'Should throw');
      } catch (error) {
        expect(error.message).to.include('User not found in database');
      }
    });

    it('creates a subscriber', async () => {
      const { subscribers } = await DripService.createSubscriber({
        email: SUBSCRIBER_EMAIL,
      });
      await removeSubscriber();
      const [subscriber] = subscribers;
      expect(subscriber).to.deep.include({
        email: SUBSCRIBER_EMAIL,
        first_name: SUBSCRIBER_FIRSTNAME,
        last_name: SUBSCRIBER_LASTNAME,
        phone: SUBSCRIBER_PHONE,
        tags: ['organic', 'promo', 'test'],
        user_id: SUBSCRIBER_ID,
        custom_fields: {
          assigneeCalendlyLink: 'https://calendly.com/epotek-lydia',
          assigneeEmailAddress: 'lydia@e-potek.ch',
          assigneeName: 'Lydia Abraha',
          first_name: SUBSCRIBER_FIRSTNAME,
          last_name: SUBSCRIBER_LASTNAME,
          phone: SUBSCRIBER_PHONE,
          referringOrganisationName: 'Organisation',
          promotionName: 'Promotion',
        },
      });
    });

    describe('sets the correct tags', () => {
      let upsertSubscriberStub;
      beforeEach(() => {
        // We stub upsertSubscriber because this endpoint is tested above and it would slow the tests
        upsertSubscriberStub = sinon.stub(DripService, 'upsertSubscriber');
        upsertSubscriberStub.resolves({});
      });

      afterEach(() => {
        upsertSubscriberStub.restore();
      });

      it('when acquisition channel is REFERRAL_API', async () => {
        await UserService._update({
          id: SUBSCRIBER_ID,
          object: { acquisitionChannel: ACQUISITION_CHANNELS.REFERRAL_API },
        });
        await DripService.createSubscriber({
          email: SUBSCRIBER_EMAIL,
        });

        expect(upsertSubscriberStub.args[0][0].subscriber.tags).to.include(
          DripService.tags[ACQUISITION_CHANNELS.REFERRAL_API],
        );
      });

      it('when acquisition channel is REFERRAL_PRO', async () => {
        await UserService._update({
          id: SUBSCRIBER_ID,
          object: { acquisitionChannel: ACQUISITION_CHANNELS.REFERRAL_PRO },
        });
        await DripService.createSubscriber({
          email: SUBSCRIBER_EMAIL,
        });

        expect(upsertSubscriberStub.args[0][0].subscriber.tags).to.include(
          DripService.tags[ACQUISITION_CHANNELS.REFERRAL_PRO],
        );
      });

      it('when acquisition channel is REFERRAL_ORGANIC', async () => {
        await UserService._update({
          id: SUBSCRIBER_ID,
          object: { acquisitionChannel: ACQUISITION_CHANNELS.REFERRAL_ORGANIC },
        });
        await DripService.createSubscriber({
          email: SUBSCRIBER_EMAIL,
        });

        expect(upsertSubscriberStub.args[0][0].subscriber.tags).to.include(
          DripService.tags[ACQUISITION_CHANNELS.REFERRAL_ORGANIC],
        );
      });

      it('when acquisition channel is anything else', async () => {
        await UserService._update({
          id: SUBSCRIBER_ID,
          object: { acquisitionChannel: ACQUISITION_CHANNELS.WEBSITE },
        });
        await DripService.createSubscriber({
          email: SUBSCRIBER_EMAIL,
        });

        expect(upsertSubscriberStub.args[0][0].subscriber.tags).to.include(
          DripService.tags.ORGANIC,
        );
      });

      it('when user has a promotion', async () => {
        generator({
          loans: {
            userId: SUBSCRIBER_ID,
            promotions: { _id: 'promo' },
          },
        });

        await DripService.createSubscriber({
          email: SUBSCRIBER_EMAIL,
        });

        expect(upsertSubscriberStub.args[0][0].subscriber.tags).to.include(
          DripService.tags.PROMO,
        );
      });
    });

    it('tracks the event in analytics', async () => {
      await DripService.createSubscriber({
        email: SUBSCRIBER_EMAIL,
      });
      await removeSubscriber();

      expect(analyticsSpy.firstCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Created',
      });
    });
  });

  describe('updateSubscriber', () => {
    before(async () => {
      await DripService.createSubscriber({ email: SUBSCRIBER_EMAIL });
    });

    after(async () => {
      await removeSubscriber();
    });

    it('updates a subscriber', async () => {
      const { subscribers } = await DripService.updateSubscriber({
        email: SUBSCRIBER_EMAIL,
        object: { address1: 'Rue du test 1' },
      });
      const [subscriber] = subscribers;

      expect(subscriber).to.deep.include({ address1: 'Rue du test 1' });
    });

    it('overrides existing property', async () => {
      const { subscribers } = await DripService.updateSubscriber({
        email: SUBSCRIBER_EMAIL,
        object: { first_name: 'Dude' },
      });
      const [subscriber] = subscribers;

      expect(subscriber).to.deep.include({ first_name: 'Dude' });
    });

    it('does not override the entire custom_fields when updating one custom field', async () => {
      const { subscribers } = await DripService.updateSubscriber({
        email: SUBSCRIBER_EMAIL,
        object: { custom_fields: { assigneeName: 'Chuck Norris' } },
      });
      const [subscriber] = subscribers;

      expect(subscriber.custom_fields).to.deep.include({
        assigneeCalendlyLink: 'https://calendly.com/epotek-lydia',
        assigneeEmailAddress: 'lydia@e-potek.ch',
        assigneeName: 'Chuck Norris',
        first_name: 'Dude',
        last_name: SUBSCRIBER_LASTNAME,
        phone: SUBSCRIBER_PHONE,
        referringOrganisationName: 'Organisation',
      });
    });

    it('tracks the event in analytics', async () => {
      await DripService.updateSubscriber({
        email: SUBSCRIBER_EMAIL,
        object: { address1: 'Rue du test 1' },
      });

      expect(analyticsSpy.lastCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Updated',
      });
    });
  });

  describe('removeSubscriber', () => {
    it('removes a subscriber', async () => {
      await DripService.createSubscriber({ email: SUBSCRIBER_EMAIL });

      const { status } = await DripService.removeSubscriber({
        email: SUBSCRIBER_EMAIL,
      });

      expect(status).to.equal(204);
    });

    it('tracks the event', async () => {
      await DripService.createSubscriber({ email: SUBSCRIBER_EMAIL });

      await DripService.removeSubscriber({ email: SUBSCRIBER_EMAIL });

      expect(analyticsSpy.lastCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Removed',
      });
    });

    it('throws if subscriber does not exist on Drip', async () => {
      try {
        await DripService.removeSubscriber({ email: SUBSCRIBER_EMAIL });
        expect(1).to.equal(2, 'Should throw');
      } catch (error) {
        expect(error.message).to.include('not found');
      }
    });
  });

  describe('trackEvent', () => {
    after(async () => {
      await removeSubscriber();
    });

    it('tracks an event', async () => {
      await DripService.createSubscriber({ email: SUBSCRIBER_EMAIL });
      const { status } = await DripService.trackEvent({
        event: { action: DRIP_ACTIONS.TEST_ACTION },
        email: SUBSCRIBER_EMAIL,
      });

      expect(status).to.equal(204);
    });

    it('tracks the event in analytics', async () => {
      await DripService.trackEvent({
        event: { action: DRIP_ACTIONS.TEST_ACTION },
        email: SUBSCRIBER_EMAIL,
      });

      expect(analyticsSpy.lastCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Event Recorded',
      });
    });
  });

  // Webhooks
  // Cannot trigger Drip to call our webhooks in tests
  describe('handleAppliedTag', () => {
    const event = 'subscriber.applied_tag';

    it('does nothing if tag is not handled by us', async () => {
      await DripService.handleWebhook({
        body: { event, data: { properties: { tag: 'not_handled' } } },
      });

      expect(analyticsSpy.called).to.equal(false);
    });

    it('does nothing if tag is not LOST,QUALIFIED or CALENDLY', async () => {
      await DripService.handleWebhook({
        body: { event, data: { properties: { tag: DRIP_TAGS.TEST } } },
      });

      expect(analyticsSpy.called).to.equal(false);
    });

    it('sets the user status to LOST if tag is LOST and tracks the event in analytics', async () => {
      await DripService.handleWebhook({
        body: {
          event,
          data: {
            properties: { tag: DRIP_TAGS.LOST },
            subscriber: { email: SUBSCRIBER_EMAIL },
          },
        },
      });

      const { status } = UserService.get(SUBSCRIBER_ID, { status: 1 });

      expect(analyticsSpy.lastCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Lost',
      });
      expect(status).to.equal(USER_STATUS.LOST);
    });

    it('sets the user status to QUALIFIED if tag is QUALIFIED and tracks the event in analytics', async () => {
      await DripService.handleWebhook({
        body: {
          event,
          data: {
            properties: { tag: DRIP_TAGS.QUALIFIED },
            subscriber: { email: SUBSCRIBER_EMAIL },
          },
        },
      });

      const { status } = UserService.get(SUBSCRIBER_ID, { status: 1 });

      expect(analyticsSpy.lastCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Qualified',
      });
      expect(status).to.equal(USER_STATUS.QUALIFIED);
    });

    it('sets the user status to QUALIFIED if tag is CALENDLY and tracks the event in analytics', async () => {
      await DripService.handleWebhook({
        body: {
          event,
          data: {
            properties: { tag: DRIP_TAGS.CALENDLY },
            subscriber: { email: SUBSCRIBER_EMAIL },
          },
        },
      });

      const { status } = UserService.get(SUBSCRIBER_ID, { status: 1 });

      expect(analyticsSpy.firstCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Booked an Event',
      });
      expect(analyticsSpy.lastCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Qualified',
      });
      expect(status).to.equal(USER_STATUS.QUALIFIED);
    });
  });

  describe('handleDeleted', () => {
    const event = 'subscriber.deleted';

    it('sets the user status to LOST', async () => {
      await DripService.handleWebhook({
        body: {
          event,
          data: {
            subscriber: { email: SUBSCRIBER_EMAIL },
          },
        },
      });

      const { status } = UserService.get(SUBSCRIBER_ID, { status: 1 });

      expect(analyticsSpy.lastCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Removed',
      });
      expect(status).to.equal(USER_STATUS.LOST);
    });

    it('does nothing if user is not found', async () => {
      await DripService.handleWebhook({
        body: {
          event,
          data: {
            subscriber: { email: 'wrong@e-potek.ch' },
          },
        },
      });

      expect(analyticsSpy.called).to.equal(false);
    });
  });

  describe('handleUnsubscribe', () => {
    const event = 'subscriber.unsubscribed_all';

    after(() => {
      removeSubscriber();
    });

    // All checks are performed in one test to avoid calling Drip API multiple times
    it('sets the user status to LOST, tags the subscriber to LOST and tracks the event in analytics', async () => {
      await DripService.createSubscriber({ email: SUBSCRIBER_EMAIL });
      await DripService.handleWebhook({
        body: {
          event,
          data: {
            subscriber: { email: SUBSCRIBER_EMAIL },
          },
        },
      });

      const { status } = UserService.get(SUBSCRIBER_ID, { status: 1 });

      expect(analyticsSpy.lastCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Unsubscribed',
      });
      expect(status).to.equal(USER_STATUS.LOST);

      const { subscribers } = await DripService.fetchSubscriber({
        subscriber: { email: SUBSCRIBER_EMAIL },
      });
      const [{ tags }] = subscribers;

      expect(tags).to.include(DRIP_TAGS.LOST);
    });
  });

  // TODO: add email activity
  // Waiting on Drip's answer regarding the email name
  describe.skip('handleReceivedEmail', () => {
    const event = 'subscriber.received_email';

    it('adds the email activity and tracks the event in analytics', async () => {
      await DripService.handleWebhook({
        body: {
          event,
          data: {
            properties: { email_id: 'emailId', email_subject: 'emailSubject' },
            subscriber: { email: SUBSCRIBER_EMAIL },
          },
        },
      });
    });
  });

  describe('openedEmail', () => {
    const event = 'subscriber.opened_email';

    it('tracks the event in analytics', async () => {
      await DripService.handleWebhook({
        body: {
          event,
          data: {
            properties: { email_id: 'emailId', email_subject: 'emailSubject' },
            subscriber: { email: SUBSCRIBER_EMAIL },
          },
        },
      });

      expect(analyticsSpy.lastCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Opened Email',
      });
      expect(analyticsSpy.lastCall.args[0].properties).to.deep.include({
        dripEmailId: 'emailId',
        dripEmailSubject: 'emailSubject',
      });
    });
  });

  describe('handleClickedEmail', () => {
    const event = 'subscriber.clicked_email';

    it('tracks the event in analytics', async () => {
      await DripService.handleWebhook({
        body: {
          event,
          data: {
            properties: {
              email_id: 'emailId',
              email_subject: 'emailSubject',
              url: 'someUrl',
            },
            subscriber: { email: SUBSCRIBER_EMAIL },
          },
        },
      });

      expect(analyticsSpy.lastCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Clicked Email',
      });
      expect(analyticsSpy.lastCall.args[0].properties).to.deep.include({
        dripEmailId: 'emailId',
        dripEmailSubject: 'emailSubject',
        dripEmailUrl: 'someUrl',
      });
    });
  });

  describe('handleBounced', () => {
    const event = 'subscriber.bounced';

    after(() => {
      removeSubscriber();
    });

    // All checks are performed in one test to avoid calling Drip API multiple times
    it('sets the user status to LOST, tags the subscriber to LOST and tracks the event in analytics', async () => {
      await DripService.createSubscriber({ email: SUBSCRIBER_EMAIL });
      await DripService.handleWebhook({
        body: {
          event,
          data: {
            subscriber: { email: SUBSCRIBER_EMAIL },
            properties: { email_id: 'emailId', email_subject: 'emailSubject' },
          },
        },
      });

      const { status } = UserService.get(SUBSCRIBER_ID, { status: 1 });

      expect(analyticsSpy.lastCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Bounced',
      });
      expect(analyticsSpy.lastCall.args[0].properties).to.deep.include({
        dripEmailId: 'emailId',
        dripEmailSubject: 'emailSubject',
      });

      expect(status).to.equal(USER_STATUS.LOST);

      const { subscribers } = await DripService.fetchSubscriber({
        subscriber: { email: SUBSCRIBER_EMAIL },
      });
      const [{ tags }] = subscribers;

      expect(tags).to.include(DRIP_TAGS.LOST);
    });
  });

  describe('handleComplained', () => {
    const event = 'subscriber.complained';

    after(() => {
      removeSubscriber();
    });

    // All checks are performed in one test to avoid calling Drip API multiple times
    it('sets the user status to LOST, tags the subscriber to LOST and tracks the event in analytics', async () => {
      await DripService.createSubscriber({ email: SUBSCRIBER_EMAIL });
      await DripService.handleWebhook({
        body: {
          event,
          data: {
            subscriber: { email: SUBSCRIBER_EMAIL },
            properties: { email_id: 'emailId', email_subject: 'emailSubject' },
          },
        },
      });

      const { status } = UserService.get(SUBSCRIBER_ID, { status: 1 });

      expect(analyticsSpy.lastCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Complained',
      });
      expect(analyticsSpy.lastCall.args[0].properties).to.deep.include({
        dripEmailId: 'emailId',
        dripEmailSubject: 'emailSubject',
      });

      expect(status).to.equal(USER_STATUS.LOST);

      const { subscribers } = await DripService.fetchSubscriber({
        subscriber: { email: SUBSCRIBER_EMAIL },
      });
      const [{ tags }] = subscribers;

      expect(tags).to.include(DRIP_TAGS.LOST);
    });
  });
});
