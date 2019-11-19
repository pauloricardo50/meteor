/* eslint-env mocha */
import { expect } from 'chai';

import { getAddressString, isIncompleteAddress } from '../../googleMapsHelpers';

describe('googleMapsHelpers', () => {
  let address;

  beforeEach(() => {
    address = { address1: 'Thamel Marg', city: 'Kathmandu', zipCode: '123456' };
  });

  describe('isIncompleteAddress', () => {
    it('returns true when the address is incomplete', () => {
      address = { city: 'Kathmandu', zipCode: '123456' };
      expect(isIncompleteAddress(address)).to.equal(true);
    });

    it('returns true when the address is an empty string', () => {
      address = { address1: '', city: 'Kathmandu', zipCode: '123456' };
      expect(isIncompleteAddress(address)).to.equal(true);
    });

    it('returns false when the address is complete', () => {
      expect(isIncompleteAddress(address)).to.equal(false);
    });
  });

  describe('getAddressString', () => {
    it('returns a formated address', () => {
      expect(getAddressString(address)).to.equal(
        'Thamel Marg, 123456 Kathmandu',
      );
    });
  });
});
