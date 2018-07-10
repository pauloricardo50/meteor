/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { Meteor } from 'meteor/meteor';
import { analytics as okgrowAnalyticsModule } from 'meteor/okgrow:analytics';

import { makeClientAnalytics } from '../../factories';
import analytics from '../analytics';
import EVENTS, { addEvent } from '../../events';

let okgrowAnalytics;
let clientAnalytics;

addEvent('SUBMITTED_USER_FORM', {
  config: ({ name }) => ({
    eventName: 'Submitted form',
    metadata: { name, staticMeta: 'info' },
  }),
});

addEvent('SCROLLED_PAGE', {
  throttle: 250,
  config: ({ yCoordinate }) => ({
    eventName: 'Scrolled Page',
    metadata: { yCoordinate },
  }),
});

addEvent('CLICKED_LOGIN_BUTTON', {
  config: {
    eventName: 'Clicked Login Button',
  },
});

addEvent('TRACKED_ONLY_ONCE', {
  trackOncePerSession: true,
  config: {
    eventName: 'Some event name',
  },
});

describe('Client analytics', () => {
  beforeEach(() => {
    okgrowAnalytics = {
      identify: sinon.spy(),
      track: sinon.spy(),
    };
    clientAnalytics = makeClientAnalytics(okgrowAnalytics, true);
  });

  it('is correctly being initialized using the factory', () => {
    const analyticsProduct = makeClientAnalytics(okgrowAnalyticsModule);
    expect(analytics.track.toString()).to.equal(analyticsProduct.track.toString());
  });

  describe('track', () => {
    it('does not allow tracking in test mode', () => {
      const analyticsLibraryStub = {
        identify: sinon.spy(),
        track: sinon.spy(),
      };
      const analyticsModule = makeClientAnalytics(analyticsLibraryStub);

      analyticsModule.track(EVENTS.SUBMITTED_USER_FORM, { name: 'Alex' });

      expect(analyticsLibraryStub.track.called).to.equal(false);
    });

    it('does not allow tracking in full-app test mode', () => {
      Meteor.isTest = false;
      Meteor.isAppTest = true;

      const analyticsLibraryStub = {
        identify: sinon.spy(),
        track: sinon.spy(),
      };
      const analyticsModule = makeClientAnalytics(analyticsLibraryStub);

      analyticsModule.track(EVENTS.SUBMITTED_USER_FORM, { name: 'Alex' });

      expect(analyticsLibraryStub.track.called).to.equal(false);

      Meteor.isAppTest = false;
      Meteor.isTest = true;
    });

    it('throws when no event name is provided', () => {
      addEvent('TEST_EVENT', {
        config: () => ({
          metadata: { some: 'info' },
        }),
      });

      const throwMessageRegEx = /the tracking eventName was not provided/;
      expect(() => clientAnalytics.track(EVENTS.TEST_EVENT)).to.throw(throwMessageRegEx);
    });

    it('calls `analytics.track` with the event name only', () => {
      addEvent('TEST_EVENT', {
        config: {
          eventName: 'Test Event',
        },
      });

      clientAnalytics.track(EVENTS.TEST_EVENT);
      expect(okgrowAnalytics.track.lastCall.args).to.deep.equal([
        'Test Event',
        undefined,
      ]);
    });

    it('calls `analytics.track` with both event name and metadata', () => {
      const user = { name: 'Alex Lawson' };
      clientAnalytics.track(EVENTS.SUBMITTED_USER_FORM, user);

      expect(okgrowAnalytics.track.lastCall.args).to.deep.equal([
        'Submitted form',
        { name: user.name, staticMeta: 'info' },
      ]);
    });

    // we could throttle by event name
    it(`throttles the tracking by event name
        for the given amount of time`, (done) => {
      const callerFunction = () =>
        clientAnalytics.track(EVENTS.SCROLLED_PAGE, { yCoordinate: 123 });

      callerFunction();
      callerFunction();
      expect(okgrowAnalytics.track.callCount).to.equal(1);

      setTimeout(() => {
        callerFunction();
        expect(okgrowAnalytics.track.callCount).to.equal(2);

        done();
      }, 260);
    });

    it('does not throttle an event with a different name than the throttled one', () => {
      clientAnalytics.track(EVENTS.SCROLLED_PAGE, { yCoordinate: 123 });
      clientAnalytics.track(EVENTS.CLICKED_LOGIN_BUTTON);
      clientAnalytics.track(EVENTS.CLICKED_LOGIN_BUTTON);

      expect(okgrowAnalytics.track.callCount).to.equal(3);
    });

    it('tracks by event name once per session', () => {
      sessionStorage.clear();

      clientAnalytics.track(EVENTS.TRACKED_ONLY_ONCE);
      clientAnalytics.track(EVENTS.TRACKED_ONLY_ONCE);

      expect(okgrowAnalytics.track.callCount).to.equal(1);
    });

    it(`does not limit an event's tracking to once per session
        when another event was limited like that`, () => {
      sessionStorage.clear();

      clientAnalytics.track(EVENTS.TRACKED_ONLY_ONCE);
      clientAnalytics.track(EVENTS.CLICKED_LOGIN_BUTTON);
      clientAnalytics.track(EVENTS.CLICKED_LOGIN_BUTTON);

      expect(okgrowAnalytics.track.callCount).to.equal(3);
    });
  });
});
