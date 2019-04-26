/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import faker from 'faker/locale/fr';

import { checkEmails } from '../../../../utils/testHelpers';
import generator from '../../../factories';
import LoanService from '../LoanService';
import { OWN_FUNDS_TYPES, STEPS, EMAIL_IDS } from '../../../constants';
import BorrowerService from '../../../borrowers/server/BorrowerService';
import PropertyService from '../../../properties/server/PropertyService';
import LenderService from '../../../lenders/server/LenderService';
import OfferService from '../../../offers/server/OfferService';

describe('LoanService', function () {
  this.timeout(10000);
  let loanId;
  let loan;

  beforeEach(() => {
    resetDatabase();
  });

  describe('popValue', () => {
    it('removes a value from an array', () => {
      loanId = Factory.create('loan', {
        contacts: [{ name: 'Joe', title: 'Mah dude' }],
      })._id;
      loan = LoanService.get(loanId);
      expect(loan.contacts.length).to.equal(1);

      LoanService.popValue({ loanId, object: { contacts: 1 } });

      loan = LoanService.get(loanId);
      expect(loan.contacts).to.deep.equal([]);
    });
  });

  describe('remove', () => {
    it('removes the borrowers via a before remove hook', () => {
      // Add other borrowers to simulate a real DB
      const otherBorrower = Factory.create('borrower')._id;
      const borrowerId = Factory.create('borrower')._id;
      const otherBorrower2 = Factory.create('borrower')._id;
      loanId = Factory.create('loan', { borrowerIds: [borrowerId] })._id;

      LoanService.remove({ loanId });

      expect(LoanService.find({}).count()).to.equal(0);
      expect(BorrowerService.find({ _id: borrowerId }).count()).to.equal(0);
      expect(BorrowerService.find({ _id: otherBorrower }).count()).to.equal(1);
      expect(BorrowerService.find({ _id: otherBorrower2 }).count()).to.equal(1);
    });

    it('removes the properties via a before remove hook', () => {
      const propertyId = Factory.create('property')._id;
      loanId = Factory.create('loan', { propertyIds: [propertyId] })._id;

      LoanService.remove({ loanId });

      expect(LoanService.find({}).count()).to.equal(0);
      expect(PropertyService.find({}).count()).to.equal(0);
    });

    it('does not remove if a borrower is linked to multiple loans', () => {
      const { ids } = generator({ borrowers: { loans: [{}, {}] } });
      loanId = ids.loans[0];

      LoanService.remove({ loanId });

      expect(LoanService.find({}).count()).to.equal(1);
      expect(BorrowerService.find({}).count()).to.equal(1);
    });

    it('autoremoves lenders', () => {
      const { ids } = generator({ loans: { lenders: [{}, {}, {}] } });
      loanId = ids.loans[0];

      expect(LenderService.countAll()).to.equal(3);

      LoanService.remove({ loanId });

      expect(LenderService.countAll()).to.equal(0);
    });
  });

  describe('adminLoanInsert', () => {
    let userId;

    beforeEach(() => {
      userId = 'testId';
    });

    it('inserts a property, borrower and loan', () => {
      expect(LoanService.countAll()).to.equal(0, 'loans 0');
      expect(BorrowerService.countAll()).to.equal(0, 'borrowers 0');

      LoanService.adminLoanInsert({ userId });

      expect(LoanService.countAll()).to.equal(1, 'loans 1');
      expect(BorrowerService.countAll()).to.equal(1, 'borrowers 1');
    });

    it('adds the same userId on all 3 documents', () => {
      LoanService.adminLoanInsert({ userId });

      expect(LoanService.findOne({}).userId).to.equal(userId, 'loans userId');
      expect(BorrowerService.findOne({}).userId).to.equal(
        userId,
        'borrowers userId',
      );
    });
  });

  describe('addPropertyToLoan', () => {
    it('adds the propertyId on all structures', () => {
      generator({
        loans: { _id: 'loanId', structures: [{ id: '1' }, { id: '2' }] },
        properties: { _id: 'propertyId' },
      });

      LoanService.addPropertyToLoan({
        loanId: 'loanId',
        propertyId: 'propertyId',
      });

      loan = LoanService.get('loanId');

      loan.structures.forEach(({ propertyId }) => {
        expect(propertyId).to.equal('propertyId');
      });
    });

    it('only adds the property if it is not defined', () => {
      generator({
        loans: {
          _id: 'loanId',
          structures: [
            { id: '1', propertyId: 'a' },
            { id: '2', promotionOptionId: 'b' },
            { id: '3' },
          ],
        },
        properties: { _id: 'propertyId' },
      });

      LoanService.addPropertyToLoan({
        loanId: 'loanId',
        propertyId: 'propertyId',
      });

      loan = LoanService.get('loanId');

      loan.structures.forEach(({ propertyId, promotionOptionId }, i) => {
        if (i === 2) {
          expect(propertyId).to.equal('propertyId');
        } else {
          expect(!!(propertyId || promotionOptionId)).to.equal(true);
        }
      });
    });
  });

  describe('addNewStructure', () => {
    it('adds a new structure to a loan', () => {
      loanId = Factory.create('loan')._id;
      loan = LoanService.get(loanId);

      expect(loan.structures).to.deep.equal([]);

      LoanService.addNewStructure({ loanId });
      loan = LoanService.get(loanId);

      expect(loan.structures).to.have.length(1);
      expect(typeof loan.structures[0].id).to.equal('string');
    });

    it('selects the structure if it is the first one', () => {
      loanId = Factory.create('loan')._id;
      LoanService.addNewStructure({ loanId });

      loan = LoanService.get(loanId);
      expect(loan.selectedStructure).to.equal(loan.structures[0].id);
    });

    it('does not select the structure if it is not the first one', () => {
      loanId = Factory.create('loan', {
        structures: [{ id: 'first' }],
        selectedStructure: 'first',
      })._id;
      LoanService.addNewStructure({ loanId });

      loan = LoanService.get(loanId);
      expect(loan.selectedStructure).to.equal('first');
    });

    it('duplicates the current chosen structure if it is not the first one', () => {
      loanId = Factory.create('loan', {
        structures: [
          {
            id: 'testId',
            name: 'joe',
            description: 'hello',
            fortuneUsed: 100,
          },
        ],
        selectedStructure: 'testId',
      })._id;
      LoanService.addNewStructure({ loanId });

      loan = LoanService.get(loanId);

      expect(loan.structures.length).to.equal(2);
      const { id: id1, name, ...structure1 } = loan.structures[0];
      const { id: id2, name: name2, ...structure2 } = loan.structures[1];
      expect(id1).to.not.equal(id2);
      expect(structure1).to.deep.equal(structure2);
      expect(name2).to.equal('Plan financier 2');
    });

    it('returns the id of the new structure', () => {
      loanId = Factory.create('loan')._id;
      const structureId = LoanService.addNewStructure({ loanId });

      loan = LoanService.get(loanId);

      expect(loan.structures.length).to.equal(1);
      expect(loan.structures[0].id).to.equal(structureId);
    });
  });

  describe('removeStructure', () => {
    it('removes an existing structure from a loan', () => {
      loanId = Factory.create('loan', {
        structures: [{ id: '1' }, { id: '2' }],
        selectedStructure: '1',
      })._id;
      loan = LoanService.get(loanId);

      expect(loan.structures.length).to.equal(2);

      const structureId = loan.structures[1].id;

      LoanService.removeStructure({ loanId, structureId });

      loan = LoanService.get(loanId);

      expect(loan.structures.length).to.equal(1);
      expect(loan.structures[0].id).to.not.equal(structureId);
    });

    it('throws if you try to delete the current selected structure', () => {
      const structureId = 'someId';
      loanId = Factory.create('loan', {
        structures: [{ id: structureId }],
        selectedStructure: structureId,
      })._id;

      expect(() =>
        LoanService.removeStructure({ loanId, structureId })).to.throw('pouvez pas');
    });

    it('removes a duplicate structure', () => {
      loanId = Factory.create('loan', {
        structures: [{ id: '1' }],
        selectedStructure: '1',
      })._id;

      LoanService.duplicateStructure({ loanId, structureId: '1' });

      loan = LoanService.get(loanId);

      expect(loan.structures.length).to.equal(2);

      LoanService.removeStructure({
        loanId,
        structureId: loan.structures[1].id,
      });

      loan = LoanService.get(loanId);

      expect(loan.structures.length).to.equal(1);
    });

    it('works for this edge case', () => {
      loanId = Factory.create('loan', {
        structures: [
          {
            id: 'poKbbHPf3FTKWt7vd',
            propertyWork: 339000,
          },
          {
            id: 'CfN4k8WKqRySCfvns',
            propertyWork: 339000,
          },
        ],
      })._id;

      LoanService.removeStructure({ loanId, structureId: 'CfN4k8WKqRySCfvns' });

      loan = LoanService.get(loanId);

      expect(loan.structures.length).to.equal(1);
    });
  });

  describe('updateStructure', () => {
    it('updates a structure', () => {
      const structureId = 'testId';
      const propertyId = 'property1';
      loanId = Factory.create('loan', {
        structures: [
          { id: structureId },
          { id: `${structureId}0` },
          { id: `${structureId}1` },
        ],
      })._id;
      loan = LoanService.get(loanId);
      expect(loan.structures.propertyId).to.equal(undefined);
      LoanService.updateStructure({
        loanId,
        structureId,
        structure: { propertyId },
      });

      loan = LoanService.get(loanId);
      // This structure is correct
      expect(loan.structures.find(({ id }) => id === structureId)).to.deep.include({ id: structureId, propertyId });

      // Other structures are unaffected
      loan.structures
        .filter(({ id }) => id !== structureId)
        .forEach((structure, index) => {
          expect(structure).to.deep.include({
            id: structureId + index,
          });
        });
    });
  });

  describe('selectStructure', () => {
    it('selects an existing structure', () => {
      const structureId = 'testId';
      const structureId2 = 'testId2';

      loanId = Factory.create('loan', {
        structures: [{ id: structureId }, { id: structureId2 }],
        selectedStructure: structureId,
      })._id;

      LoanService.selectStructure({ loanId, structureId: structureId2 });
      const { selectedStructure } = LoanService.get(loanId);

      expect(selectedStructure).to.equal(structureId2);
    });

    it('throws if the structure does not exist', () => {
      loanId = Factory.create('loan')._id;
      const badId = 'inexistentId';

      expect(() =>
        LoanService.selectStructure({ loanId, structureId: badId })).to.throw(badId);
    });
  });

  describe('duplicateStructure', () => {
    it('duplicates a structure with a new id', () => {
      const structureId = 'testId';

      loanId = Factory.create('loan', {
        structures: [
          {
            id: structureId,
            name: 'joe',
            description: 'hello',
            fortuneUsed: 100,
          },
        ],
      })._id;

      LoanService.duplicateStructure({ loanId, structureId });

      loan = LoanService.get(loanId);

      expect(loan.structures.length).to.equal(2);
      const { id: id1, name, ...structure1 } = loan.structures[0];
      const { id: id2, name: name2, ...structure2 } = loan.structures[1];
      expect(id1).to.not.equal(id2);
      expect(structure1).to.deep.equal(structure2);
    });

    it('duplicates properly when multiple properties exist', () => {
      const structureId = 'testId';
      const property1 = 'property1';
      const property2 = 'property2';

      loanId = Factory.create('loan', {
        propertyIds: [property1, property2],
        structures: [
          {
            id: structureId,
            name: 'joe',
            description: 'hello',
            fortuneUsed: 100,
            propertyId: property2,
          },
        ],
      })._id;

      LoanService.duplicateStructure({ loanId, structureId });

      loan = LoanService.get(loanId);

      const { id: id1, name, ...structure1 } = loan.structures[0];
      const { id: id2, name: name2, ...structure2 } = loan.structures[1];
      expect(id1).to.not.equal(id2);
      expect(structure1).to.deep.equal(structure2);
    });

    it('adds "- copie" to the title', () => {
      const structureId = 'testId';
      const name = 'my structure';

      loanId = Factory.create('loan', {
        structures: [{ id: structureId, name }],
      })._id;

      LoanService.duplicateStructure({ loanId, structureId });
      loan = LoanService.get(loanId);

      expect(loan.structures[1].name).to.equal(`${name} - copie`);
    });

    it('inserts the duplicated structure right next to the duplicating one', () => {
      const structureId = 'testId';
      const name = 'structure';
      loanId = Factory.create('loan', {
        structures: [
          { id: structureId + 0, name: name + 0 },
          { id: structureId + 1, name: name + 1 },
        ],
      })._id;

      LoanService.duplicateStructure({ loanId, structureId: structureId + 0 });
      loan = LoanService.get(loanId);

      expect(loan.structures.length).to.equal(3);
      expect(loan.structures[0].name).to.equal(name + 0);
      expect(loan.structures[1].name).to.equal(`${name + 0} - copie`);
      expect(loan.structures[2].name).to.equal(name + 1);
    });

    it('duplicates with a good name if no name is on the structure', () => {
      loanId = Factory.create('loan', {
        structures: [{ id: 'testId' }],
        selectedStructure: 'testId',
      })._id;
      LoanService.duplicateStructure({ loanId, structureId: 'testId' });
      loan = LoanService.get(loanId);
      expect(loan.structures[1].name).to.equal('Plan financier - copie');
    });
  });

  describe('getNewLoanName', () => {
    it('returns 19-0001 for the very first loan', () => {
      const name = LoanService.getNewLoanName();
      expect(name).to.equal('19-0001');
    });

    it('returns 19-0002 for the second loan', () => {
      loanId = LoanService.insert({ loan: {} });
      loan = LoanService.get(loanId);
      expect(loan.name).to.equal('19-0001');

      const name = LoanService.getNewLoanName();
      expect(name).to.equal('19-0002');
    });

    it('sorts loans properly 1', () => {
      Factory.create('loan', { name: '19-0009' });
      Factory.create('loan', { name: '19-0010' });

      const name = LoanService.getNewLoanName();
      expect(name).to.equal('19-0011');
    });

    it('sorts loans properly even if created in different order', () => {
      Factory.create('loan', { name: '19-0955' });
      Factory.create('loan', { name: '19-0153' });
      Factory.create('loan', { name: '19-0001' });

      const name = LoanService.getNewLoanName();
      expect(name).to.equal('19-0956');
    });

    it('returns 19-1234 for the nth loan', () => {
      Factory.create('loan', { name: '19-1233' });

      const name = LoanService.getNewLoanName();
      expect(name).to.equal('19-1234');
    });

    it('does not break if a 10000th loan is added', () => {
      Factory.create('loan', { name: '19-9999' });
      const name = LoanService.getNewLoanName();
      expect(name).to.equal('19-10000');
    });

    it('handles new year properly', () => {
      Factory.create('loan', { name: '19-0003' });
      const name = LoanService.getNewLoanName(new Date(2020, 1, 1));
      expect(name).to.equal('20-0001');
    });
  });

  describe('loan name regEx', () => {
    it('allows loan names with correct format', () => {
      expect(() => Factory.create('loan', { name: '18-0202' })).to.not.throw();
    });

    it('does not allow loan names with incorrect format', () => {
      expect(() => Factory.create('loan', { name: '18-202' })).to.throw('regular expression');
      expect(() => Factory.create('loan', { name: '202' })).to.throw('regular expression');
      expect(() => Factory.create('loan', { name: '1-202' })).to.throw('regular expression');
      expect(() => Factory.create('loan', { name: '18202' })).to.throw('regular expression');
      expect(() => Factory.create('loan', { name: '0202' })).to.throw('regular expression');
      expect(() => Factory.create('loan', { name: 'abc' })).to.throw('regular expression');
      expect(() => Factory.create('loan', { name: '18-a202' })).to.throw('regular expression');
    });
  });

  describe('cleanupRemovedBorrower', () => {
    it('removes all occurences of a borrower in structures', () => {
      const borrowerId = 'dude';
      const borrowerId2 = 'dude2';
      loanId = Factory.create('loan', {
        borrowerIds: [borrowerId, borrowerId2],
        structures: [
          {
            id: 'structId',
            ownFunds: [
              { borrowerId, value: 100, type: OWN_FUNDS_TYPES.BANK_3A },
              {
                borrowerId: borrowerId2,
                value: 300,
                type: OWN_FUNDS_TYPES.BANK_FORTUNE,
              },
            ],
          },
        ],
      })._id;

      LoanService.cleanupRemovedBorrower({ borrowerId });
      loan = LoanService.get(loanId);

      expect(loan.structures[0].ownFunds.length).to.equal(1);
      expect(loan.structures[0].ownFunds[0].borrowerId).to.equal(borrowerId2);
    });
  });

  describe('switchBorrower', () => {
    it('switches a borrowerId with a new one', () => {
      const oldBorrowerId = Factory.create('borrower')._id;
      const borrowerId = Factory.create('borrower')._id;
      loanId = Factory.create('loan', { borrowerIds: [oldBorrowerId] })._id;
      loan = LoanService.get(loanId);

      expect(loan.borrowerIds).to.deep.equal([oldBorrowerId]);

      LoanService.switchBorrower({ loanId, oldBorrowerId, borrowerId });

      loan = LoanService.get(loanId);

      expect(loan.borrowerIds).to.deep.equal([borrowerId]);
    });

    it('switches a borrowerId with a new one with multiple borrowers', () => {
      const oldBorrowerId = Factory.create('borrower')._id;
      const borrowerId = Factory.create('borrower')._id;
      loanId = Factory.create('loan', { borrowerIds: [oldBorrowerId, 'dude'] })
        ._id;
      loan = LoanService.get(loanId);

      expect(loan.borrowerIds).to.deep.equal([oldBorrowerId, 'dude']);

      LoanService.switchBorrower({ loanId, oldBorrowerId, borrowerId });

      loan = LoanService.get(loanId);

      expect(loan.borrowerIds).to.deep.equal([borrowerId, 'dude']);
    });

    it('deletes the old borrower if it is only on this loan', () => {
      const oldBorrowerId = Factory.create('borrower')._id;
      const borrowerId = Factory.create('borrower')._id;
      loanId = Factory.create('loan', { borrowerIds: [oldBorrowerId] })._id;

      LoanService.switchBorrower({ loanId, oldBorrowerId, borrowerId });

      const borrowers = BorrowerService.find({}).fetch();

      expect(borrowers.length).to.equal(1);
    });

    it('does not delete the old borrower if it is only on this loan', () => {
      const oldBorrowerId = Factory.create('borrower')._id;
      const borrowerId = Factory.create('borrower')._id;
      loanId = Factory.create('loan', { borrowerIds: [oldBorrowerId] })._id;
      Factory.create('loan', { borrowerIds: [oldBorrowerId] });

      LoanService.switchBorrower({ loanId, oldBorrowerId, borrowerId });

      const borrowers = BorrowerService.find({}).fetch();

      expect(borrowers.length).to.equal(2);
    });

    it('throws if the same borrower is tried to be added twice', () => {
      const oldBorrowerId = Factory.create('borrower')._id;
      const borrowerId = Factory.create('borrower')._id;
      loanId = Factory.create('loan', {
        borrowerIds: [oldBorrowerId, borrowerId],
      })._id;

      expect(() =>
        LoanService.switchBorrower({ loanId, oldBorrowerId, borrowerId })).to.throw('déjà');
    });
  });

  describe('assignLoanToUser', () => {
    it('assigns all properties and borrowers to the new user', () => {
      const userId = Factory.create('user')._id;
      const borrowerId1 = Factory.create('borrower')._id;
      const borrowerId2 = Factory.create('borrower')._id;
      const propertyId1 = Factory.create('property')._id;
      const propertyId2 = Factory.create('property')._id;
      loanId = Factory.create('loan', {
        borrowerIds: [borrowerId1, borrowerId2],
        propertyIds: [propertyId1, propertyId2],
      })._id;

      LoanService.assignLoanToUser({ loanId, userId });

      expect(LoanService.get(loanId).userId).to.equal(userId);
      expect(BorrowerService.get(borrowerId1).userId).to.equal(userId);
      expect(BorrowerService.get(borrowerId2).userId).to.equal(userId);
      expect(PropertyService.get(propertyId1).userId).to.equal(userId);
      expect(PropertyService.get(propertyId2).userId).to.equal(userId);
    });

    it('throws if a borrower is assigned to multiple loans', () => {
      const borrowerId1 = Factory.create('borrower')._id;
      const borrowerId2 = Factory.create('borrower')._id;

      loanId = Factory.create('loan', {
        borrowerIds: [borrowerId1],
      })._id;
      Factory.create('loan', {
        borrowerIds: [borrowerId1, borrowerId2],
      });

      expect(() =>
        LoanService.assignLoanToUser({ loanId, userId: 'dude' })).to.throw('emprunteur');
    });

    it('throws if a property is assigned to multiple loans', () => {
      const propertyId1 = Factory.create('property')._id;
      const propertyId2 = Factory.create('property')._id;

      loanId = Factory.create('loan', { propertyIds: [propertyId1] })._id;
      Factory.create('loan', { propertyIds: [propertyId2, propertyId1] });

      expect(() =>
        LoanService.assignLoanToUser({ loanId, userId: 'dude' })).to.throw('bien immobilier');
    });
  });

  describe('sendNegativeFeedbackToAllLenders', () => {
    let addresses = [];
    const insertMultipleOffers = ({
      numberOfLenders,
      numberOfOffersPerLender,
    }) => {
      let offerIds = [];

      [...Array(numberOfLenders)].forEach((_, index) => {
        // Create contact
        const address = faker.internet.email();
        addresses = [...addresses, address];
        const contactId = Factory.create('contact', { emails: [{ address }] })
          ._id;

        // Create org
        const organisationId = Factory.create('organisation', {
          contactIds: [{ _id: contactId }],
          name: `org ${index}`,
        })._id;

        // Create lender
        const lenderId = LenderService.insert({
          lender: { loanId },
          organisationId,
          contactId,
        });

        // Create offers
        [...Array(numberOfOffersPerLender)].forEach(() => {
          offerIds = [
            ...offerIds,
            OfferService.insert({
              offer: { interest10: 1, maxAmount: 1000000, lenderId },
            }),
          ];
        });
      });

      return offerIds;
    };

    beforeEach(() => {
      resetDatabase();
      loanId = 'someLoan';
      generator({
        users: [
          { _id: 'adminId', _factory: 'adminEpotek' },
          {
            _id: 'userId',
            assignedEmployee: { _id: 'adminId' },
            loans: {
              _id: loanId,
              borrowers: {},
              properties: {
                _id: 'propertyId',
                address1: 'rue du lac 31',
                zipCode: 1400,
                city: 'Yverdon',
              },
              structures: [{ id: 'struct', propertyId: 'propertyId' }],
              selectedStructure: 'struct',
            },
          },
        ],
      });

      addresses = [];
    });

    it('sends a negative feedback to all lenders', () => {
      const numberOfLenders = 5;
      const numberOfOffersPerLender = 1;

      const offerIds = insertMultipleOffers({
        loanId,
        numberOfLenders,
        numberOfOffersPerLender,
      });

      expect(offerIds.length).to.equal(numberOfLenders * numberOfOffersPerLender);

      return LoanService.sendNegativeFeedbackToAllLenders({ loanId })
        .then(() => checkEmails(numberOfLenders))
        .then((emails) => {
          expect(emails.length).to.equal(numberOfLenders);
          addresses.forEach(email =>
            expect(emails.some(({ address }) => address === email)).to.equal(true));
        });
    });

    it('sends a negative feedback to all lenders once only', () => {
      const numberOfLenders = 5;
      const numberOfOffersPerLender = 10;

      const offerIds = insertMultipleOffers({
        loanId,
        numberOfLenders,
        numberOfOffersPerLender,
      });

      expect(offerIds.length).to.equal(numberOfLenders * numberOfOffersPerLender);

      return LoanService.sendNegativeFeedbackToAllLenders({ loanId })
        .then(() => checkEmails(numberOfLenders))
        .then((emails) => {
          expect(emails.length).to.equal(numberOfLenders);
          addresses.forEach(email =>
            expect(emails.some(({ address }) => address === email)).to.equal(true));
        });
    });

    it('does not send any feedback if there is no lender', () =>
      LoanService.sendNegativeFeedbackToAllLenders({ loanId })
        .then(() => checkEmails(0))
        .then((emails) => {
          expect(emails.length).to.equal(0);
        }));

    it('does not send any feedback if there is no offer', () => {
      const numberOfLenders = 5;
      const numberOfOffersPerLender = 0;

      const offerIds = insertMultipleOffers({
        loanId,
        numberOfLenders,
        numberOfOffersPerLender,
      });

      expect(offerIds.length).to.equal(0);

      return LoanService.sendNegativeFeedbackToAllLenders({ loanId })
        .then(() => checkEmails(0))
        .then((emails) => {
          expect(emails.length).to.equal(0);
        });
    });
  });

  describe('setStep', () => {
    it('sets the step', () => {
      generator({
        loans: { _id: 'id', step: STEPS.SOLVENCY },
      });

      LoanService.setStep({ loanId: 'id', nextStep: STEPS.REQUEST });

      loan = LoanService.get('id');

      expect(loan.step).to.equal(STEPS.REQUEST);
    });

    it('sends a notification email if the step goes from SOLVENCY to OFFERS', () => {
      generator({
        users: {
          _id: 'admin',
          _factory: 'admin',
          firstName: 'Admin',
          lastName: 'User',
        },
        loans: {
          _id: 'myLoan',
          step: STEPS.SOLVENCY,
          user: {
            emails: [{ address: 'john@doe.com', verified: false }],
            assignedEmployeeId: 'admin',
          },
        },
      });

      LoanService.setStep({ loanId: 'myLoan', nextStep: STEPS.OFFERS });

      loan = LoanService.get('myLoan');

      expect(loan.step).to.equal(STEPS.OFFERS);

      return checkEmails(1).then((emails) => {
        const {
          emailId,
          address,
          response: { status },
          template: {
            message: {
              from_email,
              subject,
              global_merge_vars,
              from_name,
            },
          },
        } = emails[0];

        expect(status).to.equal('sent');
        expect(emailId).to.equal(EMAIL_IDS.FIND_LENDER_NOTIFICATION);
        expect(address).to.equal('john@doe.com');
        expect(from_email).to.equal('info@e-potek.ch');
        expect(from_name).to.equal('e-Potek');
        expect(subject).to.include('[e-Potek] Identifiez votre prêteur');
        expect(global_merge_vars.find(({ name }) => name === 'CTA_URL').content).to.include('/loans/myLoan');
        expect(global_merge_vars.find(({ name }) => name === 'BODY').content).to.include('Admin User');
      });
    });

    it('sends a notification email if the step goes from REQUEST to OFFERS', () => {
      generator({
        users: { _id: 'admin' },
        loans: {
          _id: 'myLoan',
          step: STEPS.REQUEST,
          user: {
            emails: [{ address: 'john@doe.com', verified: false }],
            assignedEmployeeId: 'admin',
          },
        },
      });
      LoanService.setStep({ loanId: 'myLoan', nextStep: STEPS.OFFERS });

      return checkEmails(1).then((emails) => {
        const {
          emailId,
          response: { status },
        } = emails[0];

        expect(status).to.equal('sent');
        expect(emailId).to.equal(EMAIL_IDS.FIND_LENDER_NOTIFICATION);
      });
    });

    it('does not send a notification email if the step goes from REQUEST to OFFERS', () => {
      generator({
        loans: {
          _id: 'myLoan',
          step: STEPS.CLOSING,
          user: { emails: [{ address: 'john@doe.com', verified: false }] },
        },
      });
      LoanService.setStep({ loanId: 'myLoan', nextStep: STEPS.OFFERS });

      return checkEmails(1, { timeout: 2000 }).then((emails) => {
        expect(emails.length).to.equal(0);
      });
    });
  });
});
