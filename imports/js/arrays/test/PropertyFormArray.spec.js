/* eslint-env mocha */
import { expect } from 'chai';

import getPropertyArray from '../PropertyFormArray';

describe('getPropertyArray', () => {
  it('throws if no loanRequest is passed', () => {
    expect(() => getPropertyArray()).to.throw();
  });

  it('returns an array of objects, with an id in each', () => {
    const arr = getPropertyArray({ general: {}, property: {} }, [{}]);
    expect(arr).to.have.length.above(0);

    arr.forEach((field) => {
      if (field.type !== 'conditionalInput' && field.type !== 'h3') {
        expect(!!field.id).to.equal(true);
      }
    });
  });
});
