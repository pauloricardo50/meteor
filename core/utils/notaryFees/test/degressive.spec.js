// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import degressive from '../degressive';

describe('degressive', () => {
  it('returns 0 for amount of 0', () => {
    expect(degressive(0)).to.equal(0);
  });

  it('returns 0 for negative amounts', () => {
    expect(degressive(-5)).to.equal(0);
  });

  it('uses single brackets', () => {
    expect(degressive(100, [{ rate: 0.1, max: 1000 }])).to.equal(10);
  });

  it('uses multiple brackets', () => {
    expect(degressive(800, [{ rate: 0.1, max: 500 }, { rate: 0.2, max: 1000 }])).to.equal(110);
  });

  it('ignores higher brackets', () => {
    expect(degressive(800, [
      { rate: 0.1, max: 500 },
      { rate: 0.2, max: 1000 },
      { rate: 0.3, max: 1100 },
    ])).to.equal(110);
  });

  it('works with longer tax bracket tables', () => {
    expect(degressive(800, [
      { rate: 0.1, max: 100 },
      { rate: 0.2, max: 200 },
      { rate: 0.3, max: 300 },
      { rate: 0.4, max: 400 },
      { rate: 0.5, max: 500 },
      { rate: 0.6, max: 600 },
      { rate: 0.7, max: 700 },
      { rate: 0.8, max: 800 },
      { rate: 0.9, max: 900 },
    ])).to.equal(360);
  });

  it("should throw if tax brackets aren't provided in the right order", () => {
    expect(() =>
      degressive(100, [{ rate: 0.1, max: 50 }, { rate: 0.2, max: 30 }])).to.throw('increasing order');
  });
});
