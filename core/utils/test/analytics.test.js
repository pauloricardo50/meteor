/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';

import { allowTracking, track } from 'core/utils/analytics';

describe('analytics', () => {
  describe('allowTracking', () => {
    it('does not work in test mode', () => {
      expect(allowTracking()).to.equal(false);
    });

    it('does not work in full test mode', () => {
      Meteor.isTest = false;
      Meteor.isAppTest = true;
      expect(allowTracking()).to.equal(false);
      Meteor.isAppTest = false;
      Meteor.isTest = true;
    });
  });

  describe('track', () => {
    it('throws if no eventName is provided', () => {
      expect(() => track()).to.throw;
    });

    it('calls `analytics.track` with the event name only');

    it('calls `analytics.track` with both event name and metadata');

    it(`throttles the tracking of a certain event
        for the given amount of time`);
  });

  describe('debugOn', () => {
    it('calls `analytics.debug` with no params');
  });

  describe('debugOff', () => {
    it('calls `analytics.debug(false)`');
  });

  describe('trackOncePerSession', () => {
    it('should work');
  });
});
