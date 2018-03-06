/* eslint-env mocha */
import { expect } from 'chai';

import { getPropertyArray, getPropertyLoanArray } from '../PropertyFormArray';

describe('getPropertyArray', () => {
  it('throws if no loan is passed', () => {
    expect(() => getPropertyArray({})).to.throw();
  });

  it('returns an array of objects, with an id in each', () => {
    const arr = getPropertyArray({
      property: {},
      loan: { general: {} },
      borrowers: [{}],
    });
    expect(arr).to.have.length.above(0);

    arr.forEach((field) => {
      if (field.type !== 'conditionalInput' && field.type !== 'h3') {
        expect(!!field.id).to.equal(true);
      }
    });
  });
});

describe('getPropertyLoanArray', () => {
  it('returns an array of objects, with an id in each', () => {
    const arr = getPropertyLoanArray({
      property: {},
      loan: { general: {} },
      borrowers: [{}],
    });
    expect(arr).to.have.length.above(0);

    arr.forEach((field) => {
      if (field.type !== 'conditionalInput' && field.type !== 'h3') {
        expect(!!field.id).to.equal(true);
      }
    });
  });
});
