/* eslint-env mocha */
import { expect } from 'chai';

describe('test suite name', () => {
  it('test name', () => {
    expect(1 + 1).to.equal(2);
    expect(true).to.not.equal(false);
    expect(global.IS_WALLABY).to.equal(true);
  });
});
