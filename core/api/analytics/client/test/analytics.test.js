/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { Meteor } from 'meteor/meteor';
import { analytics as okgrowAnalyticsModule } from 'meteor/okgrow:analytics';

import { makeClientAnalytics } from '../../factories';
import analytics from '../analytics';
import EVENTS from '../../events';
import { addEvent } from '../../eventsHelpers';

let okgrowAnalytics;
let clientAnalytics;

describe('Client analytics', () => {
  before(() => {
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
  });

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

      analyticsModule.track('SUBMITTED_USER_FORM', { name: 'Alex' });

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

      analyticsModule.track('SUBMITTED_USER_FORM', { name: 'Alex' });

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
      expect(() => clientAnalytics.track('TEST_EVENT')).to.throw(throwMessageRegEx);
    });

    it('calls `analytics.track` with the event name only', () => {
      addEvent('TEST_EVENT', {
        config: {
          eventName: 'Test Event',
        },
      });

      clientAnalytics.track('TEST_EVENT');
      expect(okgrowAnalytics.track.lastCall.args).to.deep.equal([
        'Test Event',
        undefined,
      ]);
    });

    it('calls `analytics.track` with both event name and metadata', () => {
      const user = { name: 'Alex Lawson' };
      clientAnalytics.track('SUBMITTED_USER_FORM', user);

      expect(okgrowAnalytics.track.lastCall.args).to.deep.equal([
        'Submitted form',
        { name: user.name, staticMeta: 'info' },
      ]);
    });

    it(`throttles the tracking by event
        for the given amount of time`, (done) => {
      const callerFunction = () =>
        clientAnalytics.track('SCROLLED_PAGE', { yCoordinate: 123 });

      callerFunction();
      callerFunction();
      expect(okgrowAnalytics.track.callCount).to.equal(1);

      setTimeout(() => {
        callerFunction();
        expect(okgrowAnalytics.track.callCount).to.equal(2);

        done();
      }, 260);
    });

    it('does not throttle an event different than the throttled one', () => {
      clientAnalytics.track('SCROLLED_PAGE', { yCoordinate: 123 });
      clientAnalytics.track('CLICKED_LOGIN_BUTTON');
      clientAnalytics.track('CLICKED_LOGIN_BUTTON');

      expect(okgrowAnalytics.track.callCount).to.equal(3);
    });

    it('tracks by event name once per session', () => {
      sessionStorage.clear();

      clientAnalytics.track('TRACKED_ONLY_ONCE');
      clientAnalytics.track('TRACKED_ONLY_ONCE');

      expect(okgrowAnalytics.track.callCount).to.equal(1);
    });

    it(`does not limit an event's tracking to once per session
        when another event was limited like that`, () => {
      sessionStorage.clear();

      clientAnalytics.track('TRACKED_ONLY_ONCE');
      clientAnalytics.track('CLICKED_LOGIN_BUTTON');
      clientAnalytics.track('CLICKED_LOGIN_BUTTON');

      expect(okgrowAnalytics.track.callCount).to.equal(3);
    });
  });
});
