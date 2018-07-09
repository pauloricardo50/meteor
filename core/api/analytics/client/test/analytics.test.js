/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { Meteor } from 'meteor/meteor';
import { analytics as okgrowAnalyticsModule } from 'meteor/okgrow:analytics';

import { makeClientAnalytics } from '../../factories';
import analytics from '../analytics';

let okgrowAnalytics;
let clientAnalytics;

describe('Client analytics', () => {
  beforeEach(() => {
    okgrowAnalytics = {
      identify: sinon.spy(),
      track: sinon.spy(),
    };
    clientAnalytics = makeClientAnalytics(okgrowAnalytics, true);
  });

  it('is correctly using the factory for instantiation', () => {
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

      analyticsModule.track('Some event', { someInfo: 'abc' });

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

      analyticsModule.track('Some event', { someInfo: 'abc' });

      expect(analyticsLibraryStub.track.called).to.equal(false);

      Meteor.isAppTest = false;
      Meteor.isTest = true;
    });

    it('throws when no eventName is provided', () => {
      const throwMessageRegEx = /the tracking eventName was not provided/;
      expect(() => clientAnalytics.track()).to.throw(throwMessageRegEx);
    });

    it('calls `analytics.track` with the event name only', () => {
      clientAnalytics.track('Event name');
      expect(okgrowAnalytics.track.lastCall.args).to.deep.equal([
        'Event name',
        undefined,
      ]);
    });

    it('calls `analytics.track` with both event name and metadata', () => {
      const metadata = { nameInput: 'Alex Lawson' };
      clientAnalytics.track('Clicked button', metadata);

      expect(okgrowAnalytics.track.lastCall.args).to.deep.equal([
        'Clicked button',
        metadata,
      ]);
    });

    // we can throttle by event name
    it.skip(`throttles the tracking by event name
        for the given amount of time`, (done) => {
      const callerFunction = () =>
        clientAnalytics.track('Event name', { throttle: 250 });

      callerFunction();
      callerFunction();
      expect(okgrowAnalytics.track.callCount).to.equal(1);

      setTimeout(() => {
        callerFunction();
        expect(okgrowAnalytics.track.callCount).to.equal(2);

        done();
      }, 250);
    });

    it.skip('does not throttle an event with a different name than the throttled one', () => {
      clientAnalytics.track('Event name 1', { throttle: 250 });
      clientAnalytics.track('Event name 2');
      clientAnalytics.track('Event name 2');

      expect(okgrowAnalytics.track.callCount).to.equal(3);
    });

    it.skip('tracks by event name once per session', () => {
      const eventName = 'An event';
      const callerFunction = () =>
        clientAnalytics.track(eventName, { oncePerSession: true });

      expect(sessionStorage.getItem(`epotek-tracking.${eventName}`)).to.equal(undefined);
      callerFunction();
      expect(sessionStorage.getItem(`epotek-tracking.${eventName}`)).to.equal(eventName);

      callerFunction();

      expect(okgrowAnalytics.track.callCount).to.equal(1);
    });

    it.skip(`does not limit an event's tracking to once per session
        when another event was limited like that`, () => {
      clientAnalytics.track('Event 1', { oncePerSession: true });
      clientAnalytics.track('Event 2');
      clientAnalytics.track('Event 2');

      expect(okgrowAnalytics.track.callCount).to.equal(3);
    });
  });
});
