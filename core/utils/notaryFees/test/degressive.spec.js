//
/* eslint-env mocha */
import { expect } from 'chai';

import degressive from '../degressive';
import { VD } from '../cantonConstants';

describe('degressive', () => {
  it('returns 0 for amount of 0', () => {
    expect(degressive({ amount: 0 })).to.equal(0);
  });

  it('returns 0 for negative amounts', () => {
    expect(degressive({ amount: -5 })).to.equal(0);
  });

  it('returns 0 if no brackets are given', () => {
    expect(degressive({ amount: 100 })).to.equal(0);
    expect(degressive({ amount: 100, brackets: [] })).to.equal(0);
  });

  it('uses single brackets', () => {
    expect(
      degressive({ amount: 100, brackets: [{ rate: 0.1, max: 1000 }] }),
    ).to.equal(10);
  });

  it('uses multiple brackets', () => {
    expect(
      degressive({
        amount: 800,
        brackets: [
          { rate: 0.1, max: 500 },
          { rate: 0.2, max: 1000 },
        ],
      }),
    ).to.equal(110);
  });

  it('ignores higher brackets', () => {
    expect(
      degressive({
        amount: 800,
        brackets: [
          { rate: 0.1, max: 500 },
          { rate: 0.2, max: 1000 },
          { rate: 0.3, max: 1100 },
        ],
      }),
    ).to.equal(110);
  });

  it('works with longer tax bracket tables', () => {
    expect(
      degressive({
        amount: 800,
        brackets: [
          { rate: 0.1, max: 100 },
          { rate: 0.2, max: 200 },
          { rate: 0.3, max: 300 },
          { rate: 0.4, max: 400 },
          { rate: 0.5, max: 500 },
          { rate: 0.6, max: 600 },
          { rate: 0.7, max: 700 },
          { rate: 0.8, max: 800 },
          { rate: 0.9, max: 900 },
        ],
      }),
    ).to.equal(360);
  });

  it("should throw if tax brackets aren't provided in the right order", () => {
    expect(() =>
      degressive({
        amount: 100,
        brackets: [
          { rate: 0.1, max: 50 },
          { rate: 0.2, max: 30 },
        ],
      }),
    ).to.throw('increasing order');
  });

  it('should cap the degressive tax if maxTax is given', () => {
    expect(
      degressive({
        amount: 1000,
        brackets: [{ max: 500, rate: 0.5 }],
        maxTax: 200,
      }),
    ).to.equal(200);
  });

  it('should use minTax if provided', () => {
    expect(
      degressive({
        amount: 1000,
        brackets: [{ max: 500, rate: 0.5 }],
        minTax: 400,
      }),
    ).to.equal(400);
  });

  it('should use the last bracket on the remaining amount if it has no max value', () => {
    expect(
      degressive({
        amount: 1000,
        brackets: [{ rate: 0.1, max: 200 }, { rate: 0.2 }],
      }),
    ).to.equal(180);
  });

  it('should use minTax if min and max are provided', () => {
    expect(
      degressive({
        amount: 1000,
        brackets: [{ max: 500, rate: 0.5 }],
        minTax: 400,
        maxTax: 1000,
      }),
    ).to.equal(400);
  });

  it('should use maxTax if min and max are provided', () => {
    expect(
      degressive({
        amount: 1000000,
        brackets: [{ max: 100000, rate: 0.5 }],
        minTax: 400,
        maxTax: 1000,
      }),
    ).to.equal(1000);
  });

  it('works for this VD example confirmed by a notary', () => {
    expect(
      degressive({
        amount: 940000,
        brackets: VD.NOTARY_NOTE_BRACKETS,
      }),
    ).to.equal(2585);
  });
});
