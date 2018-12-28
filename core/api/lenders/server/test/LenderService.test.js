// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import LenderService from '../../LenderService';
import OfferService from '../../../offers/OfferService';

describe('LenderService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('remove', () => {
    it('removes all offers related to this lender', () => {
      const loanId = Factory.create('loan')._id;
      const lenderId = LenderService.insert({ lender: { loanId } });
      const offerId = Factory.create('offer')._id;

      OfferService.addLink({
        id: offerId,
        linkName: 'lender',
        linkId: lenderId,
      });

      LenderService.remove({ lenderId });

      expect(LenderService.countAll()).to.equal(0, 'lender removed');
      expect(OfferService.countAll()).to.equal(0, 'offer removed');
    });
  });
});
