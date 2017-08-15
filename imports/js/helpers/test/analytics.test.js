/* eslint-env mocha */
import { expect } from 'chai';

import { allowTracking, track, addUserTracking } from '../analytics';

describe('analytics', () => {
  describe('allowTracking', () => {
    it('does not work in test mode', () => {
      expect(allowTracking()).to.equal(false);
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
