// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import OfferService from '../../OfferService';

describe('OfferService', () => {
  let offer;
  let offerId;

  beforeEach(() => {
    resetDatabase();
  });

  describe('update', () => {
    it('modifies an offer', () => {
      offer = Factory.create('offer', { interest10: 1, loanId: 'loanId' });
      offerId = offer._id;
      expect(offer.interest10).to.equal(1);

      OfferService.update({ offerId, object: { interest10: 2 } });
      offer = OfferService.getOfferById(offerId);

      expect(offer.interest10).to.equal(2);
    });
  });

  describe('insert', () => {
    it('inserts an offer', () => {
      offerId = OfferService.insert({
        offer: {
          loanId: 'loanId',
          organisation: 'UBS',
          maxAmount: 800000,
          amortization: 10000,
        },
      });
      offer = OfferService.getOfferById(offerId);

      expect(offer.createdAt).to.not.equal(undefined);
    });
  });

  describe('remove', () => {
    it('removes an offer', () => {
      offer = Factory.create('offer', { interest10: 1, loanId: 'loanId' });
      offerId = offer._id;

      OfferService.remove({ offerId });
      offer = OfferService.getOfferById(offerId);

      expect(offer).to.equal(undefined);
    });
  });
});
