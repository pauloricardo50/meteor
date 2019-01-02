// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import LenderService from '../../LenderService';
import OfferService from '../../../offers/OfferService';
import OrganisationService from '../../../organisations/OrganisationService';

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

  describe('insert', () => {
    it('it gets the first contact of the organisation if none is provided', () => {
      const loanId = Factory.create('loan')._id;
      const organisationId = Factory.create('organisation')._id;
      const contactId1 = Factory.create('contact', { firstName: 'john' })._id;
      const contactId2 = Factory.create('contact', { firstName: 'joe' })._id;
      OrganisationService.addLink({
        id: organisationId,
        linkName: 'contacts',
        linkId: contactId1,
      });
      OrganisationService.addLink({
        id: organisationId,
        linkName: 'contacts',
        linkId: contactId2,
      });
      const lenderId = LenderService.insert({
        lender: { loanId },
        organisationId,
      });

      const lender = LenderService.fetchOne({
        $filters: { _id: lenderId },
        contact: { firstName: 1 },
      });

      expect(lender.contact.firstName).to.equal('john');
    });
  });
});
