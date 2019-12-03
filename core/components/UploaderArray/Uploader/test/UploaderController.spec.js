/* eslint-env mocha */
import { expect } from 'chai';

import { propHasChanged } from '../uploaderHelpers';

describe('UploaderController', () => {
  describe('propHasChanged', () => {
    it('returns true if the initial prop is undefined', () => {
      expect(propHasChanged(undefined, [{}])).to.equal(true);
    });

    it('returns true if the length has changed', () => {
      expect(propHasChanged([{}], [{}, {}])).to.equal(true);
    });

    it('returns false if both are undefined', () => {
      expect(propHasChanged(undefined, undefined)).to.equal(false);
    });

    it('returns false if both have same length', () => {
      expect(propHasChanged([{}], [{}])).to.equal(false);
    });
  });
});
