/* eslint-env mocha */
import { expect } from 'chai';

describe('Wallaby examples', () => {
  it('should work', () => {
    expect(1 + 1).to.equal(2);
    expect(true).to.not.equal(false);
    if (global.IS_WALLABY) {
      expect(global.IS_WALLABY).to.equal(true);
    }
  });
});
