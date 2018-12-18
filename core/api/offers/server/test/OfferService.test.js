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
      offer = Factory.create('offer', { interest10: 0.05, loanId: 'loanId' });
      offerId = offer._id;
      expect(offer.interest10).to.equal(0.05);

      OfferService.update({ offerId, object: { interest10: 0.1 } });
      offer = OfferService.get(offerId);

      expect(offer.interest10).to.equal(0.1);
    });
  });

  describe('insert', () => {
    it('inserts an offer', () => {
      offerId = OfferService.insert({
        offer: {
          loanId: 'loanId',
          organisation: 'UBS',
          maxAmount: 800000,
          amortizationGoal: 0.65,
        },
      });
      offer = OfferService.get(offerId);

      expect(offer.createdAt).to.not.equal(undefined);
    });
  });

  describe('remove', () => {
    it('removes an offer', () => {
      offer = Factory.create('offer', { interest10: 1, loanId: 'loanId' });
      offerId = offer._id;

      OfferService.remove({ offerId });
      offer = OfferService.get(offerId);

      expect(offer).to.equal(undefined);
    });
  });
});
