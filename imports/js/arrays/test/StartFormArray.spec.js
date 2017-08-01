/* eslint-env mocha */
import { expect } from 'chai';

import testRequire from '/imports/js/helpers/testRequire';

const { default: getFormArray } =
  testRequire('../StartFormArray') || require('../StartFormArray');

describe('StartFormArray', () => {
  describe('getFormArray', () => {
    it('returns an array', () => {
      const array = getFormArray({}, {}, () => {});

      expect(array).to.have.length.above(0);
      expect(array[0].id).to.equal('propertyValue');
    });
  });
});
