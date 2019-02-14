// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import { percentFormatters } from '../formHelpers';

describe('form helpers', () => {
  describe('percentFormatters', () => {
    it('does not return NaN if an input is emptied', () => {
      expect(percentFormatters.parse('')).to.equal('');
      expect(percentFormatters.format('')).to.equal('');
    });
  });
});
