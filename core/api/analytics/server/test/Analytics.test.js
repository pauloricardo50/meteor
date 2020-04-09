/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { expect } from 'chai';
import sinon from 'sinon';

import SessionService from '../../../sessions/server/SessionService';
import SlackService from '../../../slack/server/SlackService';
import EVENTS from '../../events';
import Analytics, { checkEventsConfig } from '../Analytics';
import NoOpAnalytics from '../NoOpAnalytics';

describe('Analytics', () => {
  beforeEach(() => {
    resetDatabase();
  });

  context('Analytics', () => {
    let analyticsSpy;

    beforeEach(async () => {
      analyticsSpy = sinon.spy(NoOpAnalytics.prototype, 'track');
    });

    afterEach(() => {
      NoOpAnalytics.prototype.track.restore();
    });

    it('should track events', async () => {
      const connectionId = Random.id();

      await SessionService.insert({
        connectionId,
        ip: '127.0.0.1',
      });

      const analytics = new Analytics({ connection: { id: connectionId } });

      analytics.track(EVENTS.USER_LOGGED_IN, { type: 'password' });

      expect(analyticsSpy.callCount).to.equal(1);
    });

    it.skip('should not track events when impersonating users', async () => {
      const connectionId = Random.id();

      await SessionService.insert({
        connectionId,
        isImpersonate: true,
        ip: '127.0.0.1',
      });

      const analytics = new Analytics({ connection: { id: connectionId } });

      analytics.track(EVENTS.USER_LOGGED_IN, { type: 'password' });

      expect(analyticsSpy.callCount).to.equal(0);
    });

    describe('production-only', () => {
      before(() => {
        Meteor.isProduction = true;
      });

      after(() => {
        Meteor.isProduction = false;
      });

      it('should send a slack notification when a required property is not given to an event', async () => {
        const slackSpy = sinon.spy();
        sinon.stub(SlackService, 'sendError').callsFake(slackSpy);
        const connectionId = Random.id();

        await SessionService.insert({
          connectionId,
          ip: '127.0.0.1',
        });

        const analytics = new Analytics({ connection: { id: connectionId } });
        const data = {
          url: 'url',
          route: 'route',
          path: 'path',
        };

        analytics.track(EVENTS.CTA_CLICKED, data);

        expect(slackSpy.firstCall.args[0].error.error).to.include(
          'Property name in event CTA clicked is required',
        );
        expect(slackSpy.firstCall.args[0].additionalData[0]).to.deep.include({
          event: EVENTS.CTA_CLICKED,
          data,
          pickedProperties: { name: undefined, ...data, referrer: undefined },
        });
        expect(analyticsSpy.callCount).to.equal(1);
        SlackService.sendError.restore();
      });
    });
  });

  context('checkEventsConfig', () => {
    it('should not throw when checking default events config', () => {
      expect(checkEventsConfig).to.not.throw();
    });

    it('should throw when an event has no name in events config', () => {
      expect(() => {
        const events = { testEvent: {} };
        checkEventsConfig(events);
      }).to.throw('No name for event testEvent');
    });

    it('should throw when an event has a falsy property', () => {
      expect(() => {
        const events = {
          testEvent: { name: 'This is a test event', properties: [''] },
        };
        checkEventsConfig(events);
      }).to.throw('Falsy property');
    });

    it('should throw when an event has a nameless property', () => {
      expect(() => {
        const events = {
          testEvent: {
            name: 'This is a test event',
            properties: [{ name: '' }],
          },
        };
        checkEventsConfig(events);
      }).to.throw('No property name');
    });
  });
});
