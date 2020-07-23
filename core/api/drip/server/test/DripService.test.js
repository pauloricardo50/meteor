import { expect } from 'chai';
import sinon from 'sinon';

import { resetDatabase } from '../../../../utils/testHelpers';
import NoOpAnalytics from '../../../analytics/server/NoOpAnalytics';
import ErrorLogger from '../../../errorLogger/server/ErrorLogger';
import generator from '../../../factories/server';
import UserService from '../../../users/server/UserService';
import { ACQUISITION_CHANNELS } from '../../../users/userConstants';
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

      expect(analyticsSpy.args[0][0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Created',
      });
    });
  });

  describe('updateSubscriber', async () => {
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

      expect(analyticsSpy.args[0][0]).to.deep.include({
        userId: SUBSCRIBER_ID,
        event: 'Drip Subscriber Updated',
      });
    });
  });
});
