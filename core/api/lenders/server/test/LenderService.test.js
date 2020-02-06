/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import generator from '../../../factories';
import LoanService from '../../../loans/server/LoanService';
import TaskService from '../../../tasks/server/TaskService';
import OfferService from '../../../offers/server/OfferService';
import OrganisationService from '../../../organisations/server/OrganisationService';
import LenderService from '../LenderService';

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

      const lender = LenderService.get(lenderId, { contact: { firstName: 1 } });

      expect(lender.contact.firstName).to.equal('John');
    });
  });

  describe('remove', () => {
    it('removes the lender, the offer, the tasks and the offerId', () => {
      generator({
        loans: {
          _factory: null,
          name: '18-0001',
          lenders: {
            _factory: null,
            _id: 'lenderId',
            offers: { _id: 'offer1' },
            tasks: [{}, {}],
            organisation: {},
          },
          structures: [
            { id: 'a', offerId: 'offer1' },
            { id: 'b', offerId: 'offer2' },
          ],
        },
      });

      expect(LenderService.find({}).fetch().length).to.equal(1, 'a');
      expect(OfferService.find({}).fetch().length).to.equal(1, 'b');
      expect(TaskService.find({}).fetch().length).to.equal(2, 'c');

      LenderService.remove({ lenderId: 'lenderId' });

      expect(LenderService.find({}).fetch().length).to.equal(0);
      expect(OfferService.find({}).fetch().length).to.equal(0);
      expect(TaskService.find({}).fetch().length).to.equal(0);

      const loan = LoanService.get({}, { structures: { offerId: 1 } });

      loan.structures.map(({ offerId }) => {
        expect(offerId).to.not.equal('offer1');
      });
    });
  });
});
