import { expect } from 'chai';
// import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';

import { allowTracking, track, addUserTracking } from '../analytics';

describe('analytics', () => {
  describe('allowTracking', () => {
    it('does not work in test mode', () => {
      expect(allowTracking()).to.be.false;
    });
  });

  describe('track', () => {
    it('throws if no eventName is provided', () => {
      expect(() => track()).to.throw;
    });
  });

  describe('addUserTracking', () => {
    it('throws if no eventName is provided', () => {
      expect(() => addUserTracking()).to.throw;
    });
  });

  describe('trackOncePerSession', () => {
    it('should work');
  });
});
