/* eslint-env mocha */
import { expect } from 'chai';
import proxyquire from 'proxyquire';

import meteorStubs from '/imports/js/helpers/meteorStubs';

const proxyquireStrict = proxyquire.noCallThru();
const { getFormArray } = proxyquireStrict('../StartFormArray.js', {
  ...meteorStubs,
}).default();

console.log(getFormArray);

describe('StartFormArray', () => {
  describe('getFormArray', () => {
    it('returns an array', () => {
      const array = getFormArray({}, {}, () => {});

      expect(array).to.have.length.above(0);
    });
  });
});
