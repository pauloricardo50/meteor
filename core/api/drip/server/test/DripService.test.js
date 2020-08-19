import { Random } from 'meteor/random';

import { expect } from 'chai';
import sinon from 'sinon';

import { checkEmails, resetDatabase } from '../../../../utils/testHelpers';
import { ACTIVITY_TYPES } from '../../../activities/activityConstants';
import ActivityService from '../../../activities/server/ActivityService';
import NoOpAnalytics from '../../../analytics/server/NoOpAnalytics';
import ErrorLogger from '../../../errorLogger/server/ErrorLogger';
import generator from '../../../factories/server';
import {
  LOAN_STATUS,
  UNSUCCESSFUL_LOAN_REASONS,
} from '../../../loans/loanConstants';
import UserService from '../../../users/server/UserService';
import {
  ACQUISITION_CHANNELS,
  USER_STATUS,
} from '../../../users/userConstants';
import { DRIP_ACTIONS, DRIP_TAGS } from '../../dripConstants';
import DripService from '../DripService';

const SUBSCRIBER_FIRSTNAME = 'Subscriber';
const SUBSCRIBER_LASTNAME = 'E-Potek';
const SUBSCRIBER_PHONE = '+41 123456';

const getSubscriberEmail = () => `subscriber-${Random.id()}@e-potek.ch`;

const removeSubscriber = email => DripService.removeSubscriber({ email });

describe('DripService', function () {
  this.timeout(10000);
  let logErrorSpy;
  let analyticsSpy;
  let SUBSCRIBER_EMAIL;
  let SUBSCRIBER_ID;

  beforeEach(() => {
    resetDatabase();

    logErrorSpy = sinon.spy(ErrorLogger, 'logError');
    analyticsSpy = sinon.spy(NoOpAnalytics.prototype, 'track');
    generator({
      organisations: { _id: 'org', name: 'Organisation' },
      users: [
        {
          _id: 'pro',
          emails: [{ address: 'pro@e-potek.ch', verified: true }],
          firstName: 'Pro',
          lastName: 'User',
          organisations: {
            _id: 'org',
            $metadata: { isMain: true },
          },
        },
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
          referredByOrganisation: { _id: 'org' },
          referredByUser: { _id: 'pro' },
          loans: {
            promotions: { name: 'Promotion', $metadata: { invitedBy: 'pro' } },
          },
        },
      ],
    });
  });

  afterEach(() => {
    logErrorSpy.restore();
    analyticsSpy.restore();
  });

  context('createSubscriber', () => {
    SUBSCRIBER_EMAIL = getSubscriberEmail();
    SUBSCRIBER_ID = Random.id();
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
      await removeSubscriber(SUBSCRIBER_EMAIL);
      const [subscriber] = subscribers;
      expect(subscriber).to.deep.include({
        email: SUBSCRIBER_EMAIL,
        first_name: SUBSCRIBER_FIRSTNAME,
        last_name: SUBSCRIBER_LASTNAME,
        phone: SUBSCRIBER_PHONE,
        tags: ['ORGANIC', 'PROMO', 'TEST'],
        user_id: SUBSCRIBER_ID,
        custom_fields: {
          assigneeCalendlyLink: 'https://www.calendly.com/epotek-lydia',
          assigneeEmailAddress: 'lydia@e-potek.ch',
          assigneeJobTitle: 'Conseillère en Financement & Prévoyance',
          assigneePhone: '+41 22 566 82 92',
          assigneeName: 'Lydia Abraha',
          first_name: SUBSCRIBER_FIRSTNAME,
          last_name: SUBSCRIBER_LASTNAME,
          phone: SUBSCRIBER_PHONE,
          referringOrganisationName: 'Organisation',
          promotionName: 'Promotion',
          referringUserName: 'Pro User',
          referringUserEmail: 'pro@e-potek.ch',
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
      await removeSubscriber(SUBSCRIBER_EMAIL);

      expect(analyticsSpy.firstCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Created',
      });
    });
  });

  describe('updateSubscriber', () => {
    SUBSCRIBER_EMAIL = getSubscriberEmail();
    SUBSCRIBER_ID = Random.id();

    before(async () => {
      generator({
        users: {
          _id: SUBSCRIBER_ID,
          emails: [{ address: SUBSCRIBER_EMAIL, verified: true }],
          firstName: SUBSCRIBER_FIRSTNAME,
          lastName: SUBSCRIBER_LASTNAME,
          phoneNumbers: [SUBSCRIBER_PHONE],
          assignedEmployee: { _id: 'admin' },
          referredByOrganisation: { _id: 'org' },
          loans: { promotions: { name: 'Promotion' } },
        },
      });
      await DripService.createSubscriber({ email: SUBSCRIBER_EMAIL });
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
        assigneeCalendlyLink: 'https://www.calendly.com/epotek-lydia',
        assigneeEmailAddress: 'lydia@e-potek.ch',
        assigneeJobTitle: 'Conseillère en Financement & Prévoyance',
        assigneePhone: '+41 22 566 82 92',
        assigneeName: 'Chuck Norris',
        first_name: 'Dude',
        last_name: SUBSCRIBER_LASTNAME,
        phone: SUBSCRIBER_PHONE,
        referringOrganisationName: 'Organisation',
      });
    });
  });

  describe('removeSubscriber', () => {
    SUBSCRIBER_EMAIL = getSubscriberEmail();
    SUBSCRIBER_ID = Random.id();
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
    SUBSCRIBER_EMAIL = getSubscriberEmail();
    SUBSCRIBER_ID = Random.id();

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
    SUBSCRIBER_EMAIL = getSubscriberEmail();
    SUBSCRIBER_ID = Random.id();
    const event = 'subscriber.applied_tag';

    it('does nothing if tag is not handled by us', async () => {
      await DripService.handleWebhook({
        body: { event, data: { properties: { tag: 'not_handled' } } },
      });

      expect(analyticsSpy.called).to.equal(false);
    });

    it('does nothing if tag is not LOST, QUALIFIED or CALENDLY', async () => {
      await DripService.handleWebhook({
        body: { event, data: { properties: { tag: DRIP_TAGS.TEST } } },
      });

      expect(analyticsSpy.called).to.equal(false);
    });

    it('sets the user status to LOST if tag is LOST, tracks the event in analytics and set his loan to unsuccessful', async () => {
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

      const { loans = [] } = UserService.get(SUBSCRIBER_ID, {
        loans: { status: 1, unsuccessfulReason: 1 },
      });

      const [loan] = loans;

      expect(loan).to.deep.include({
        status: LOAN_STATUS.UNSUCCESSFUL,
        unsuccessfulReason: UNSUCCESSFUL_LOAN_REASONS.CONTACT_LOSS_NO_ANSWER,
      });

      await checkEmails(1);
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

      console.log('analyticsSpy:', analyticsSpy.args);
      expect(analyticsSpy.callCount).to.equal(3);
      expect(
        analyticsSpy.args.some(
          ([{ userId, event }]) =>
            userId === SUBSCRIBER_ID && event === 'User Changed Status',
        ),
      ).to.equal(true, 'change status');
      expect(
        analyticsSpy.args.some(
          ([{ userId, event }]) =>
            userId === SUBSCRIBER_ID &&
            event === 'Drip Subscriber Booked an Event',
        ),
      ).to.equal(true, 'booked an event');
      expect(
        analyticsSpy.args.some(
          ([{ userId, event }]) =>
            userId === SUBSCRIBER_ID && event === 'Drip Subscriber Qualified',
        ),
      ).to.equal(true, 'qualified');
      expect(status).to.equal(USER_STATUS.QUALIFIED);
    });
  });

  describe('handleDeleted', () => {
    SUBSCRIBER_EMAIL = getSubscriberEmail();
    SUBSCRIBER_ID = Random.id();
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
    SUBSCRIBER_EMAIL = getSubscriberEmail();
    SUBSCRIBER_ID = Random.id();
    const event = 'subscriber.unsubscribed_all';

    // All checks are performed in one test to avoid calling Drip API multiple times
    it('sets the user status to LOST, tags the subscriber to LOST, tracks the event in analytics and puts loans in unsuccessful', async () => {
      await DripService.createSubscriber({ email: SUBSCRIBER_EMAIL });
      await DripService.handleWebhook({
        body: {
          event,
          data: {
            subscriber: { email: SUBSCRIBER_EMAIL },
          },
        },
      });

      const { status, loans } = UserService.get(SUBSCRIBER_ID, {
        status: 1,
        loans: { status: 1 },
      });

      expect(analyticsSpy.lastCall.args[0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Unsubscribed',
      });
      expect(status).to.equal(USER_STATUS.LOST);
      expect(loans[0].status).to.equal(LOAN_STATUS.UNSUCCESSFUL);

      const { subscribers } = await DripService.fetchSubscriber({
        subscriber: { email: SUBSCRIBER_EMAIL },
      });
      const [{ tags }] = subscribers;

      expect(tags).to.include(DRIP_TAGS.LOST);

      await checkEmails(1);
    });
  });

  describe('handleReceivedEmail', () => {
    SUBSCRIBER_EMAIL = getSubscriberEmail();
    SUBSCRIBER_ID = Random.id();
    const event = 'subscriber.received_email';

    it('adds the email activity and tracks the event in analytics', async () => {
      await DripService.handleWebhook({
        body: {
          event,
          data: {
            properties: {
              email_id: 'emailId',
              email_subject: 'emailSubject',
            },
            subscriber: { email: SUBSCRIBER_EMAIL },
          },
        },
      });

      const [activity] = ActivityService.fetch({
        $filters: { 'userLink._id': SUBSCRIBER_ID },
        type: 1,
        title: 1,
        metadata: 1,
      });

      expect(activity).to.deep.include({
        title: 'Email Drip',
        type: ACTIVITY_TYPES.DRIP,
        metadata: {
          dripEmailId: 'emailId',
          dripEmailSubject: 'emailSubject',
          dripStatus: 'received',
        },
      });

      expect(analyticsSpy.args[0][0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Received Email',
      });
    });
  });

  describe('openedEmail', () => {
    SUBSCRIBER_EMAIL = getSubscriberEmail();
    SUBSCRIBER_ID = Random.id();
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
    SUBSCRIBER_EMAIL = getSubscriberEmail();
    SUBSCRIBER_ID = Random.id();
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
    SUBSCRIBER_EMAIL = getSubscriberEmail();
    SUBSCRIBER_ID = Random.id();
    const event = 'subscriber.bounced';

    // All checks are performed in one test to avoid calling Drip API multiple times
    it('sets the user status to LOST, tags the subscriber to LOST, tracks the event in analytics, adds the activity and sets the loan status to unsuccessful', async () => {
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

      const [activity] = ActivityService.fetch({
        $filters: { 'userLink._id': SUBSCRIBER_ID, type: ACTIVITY_TYPES.DRIP },
        type: 1,
        title: 1,
        metadata: 1,
      });

      expect(activity).to.deep.include({
        title: 'Email Drip - Rejet',
        type: ACTIVITY_TYPES.DRIP,
        metadata: {
          dripEmailId: 'emailId',
          dripEmailSubject: 'emailSubject',
          dripStatus: 'bounced',
        },
      });

      const { loans = [] } = UserService.get(SUBSCRIBER_ID, {
        loans: { status: 1, unsuccessfulReason: 1 },
      });

      const [loan] = loans;

      expect(loan).to.deep.include({
        status: LOAN_STATUS.UNSUCCESSFUL,
        unsuccessfulReason: UNSUCCESSFUL_LOAN_REASONS.CONTACT_LOSS_UNREACHABLE,
      });

      await checkEmails(1);
    });
  });

  describe('handleComplained', () => {
    const event = 'subscriber.complained';
    SUBSCRIBER_EMAIL = getSubscriberEmail();
    SUBSCRIBER_ID = Random.id();

    // All checks are performed in one test to avoid calling Drip API multiple times
    it('sets the user status to LOST, tags the subscriber to LOST, tracks the event in analytics and sets his loan to unsuccessful', async () => {
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

      const { loans = [] } = UserService.get(SUBSCRIBER_ID, {
        loans: { status: 1, unsuccessfulReason: 1 },
      });

      const [loan] = loans;

      expect(loan).to.deep.include({
        status: LOAN_STATUS.UNSUCCESSFUL,
        unsuccessfulReason: UNSUCCESSFUL_LOAN_REASONS.DRIP_COMPLAINED,
      });

      await checkEmails(1);
    });
  });
});
