/* eslint-env mocha */
import { expect } from 'chai';

import { percentFormatters } from '../formHelpers';

describe('form helpers', () => {
  describe('percentFormatters', () => {
    it('does not return NaN if an input is emptied', () => {
      expect(percentFormatters.parse('')).to.equal('');
      expect(percentFormatters.format('')).to.equal('');
    });

    it('does allows negative inputs', () => {
      expect(percentFormatters.parse('-2.00%')).to.equal(-0.02);
      expect(percentFormatters.format('-0.02')).to.equal('-2.00');
    });
  });
});
