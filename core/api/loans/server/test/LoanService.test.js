/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import '../../../factories';
import Loans from '../../loans';
import { Borrowers, Properties } from '../../..';
import LoanService from '../../LoanService';
import { OWN_FUNDS_TYPES } from '../../../borrowers/borrowerConstants';
import BorrowerService from '../../../borrowers/BorrowerService';

describe('LoanService', () => {
  let loanId;
  let loan;

  beforeEach(() => {
    resetDatabase();
  });

  describe('popValue', () => {
    it('removes a value from an array', () => {
      loanId = Factory.create('loan', {
        mortgageNotes: [
          { value: 150000, type: 'PAPER', category: 'REGISTERED', rank: 2 },
        ],
      })._id;
      loan = LoanService.get(loanId);
      expect(loan.mortgageNotes.length).to.equal(1);

      LoanService.popValue({ loanId, object: { mortgageNotes: 1 } });

      loan = LoanService.get(loanId);
      expect(loan.mortgageNotes).to.deep.equal([]);
    });
  });

  describe('disableUserForms', () => {
    it('disables user forms', () => {
      loanId = Factory.create('loan')._id;
      loan = LoanService.getLoanById(loanId);
      LoanService.disableUserForms({ loanId });
      loan = LoanService.getLoanById(loanId);
      expect(loan.userFormsEnabled).to.equal(false);
    });
  });

  describe('enableUserForms', () => {
    it('enables the user forms', () => {
      loanId = Factory.create('loan')._id;
      loan = LoanService.getLoanById(loanId);
      LoanService.enableUserForms({ loanId });
      loan = LoanService.getLoanById(loanId);
      expect(loan.userFormsEnabled).to.equal(true);
    });
  });

  describe('adminLoanInsert', () => {
    let userId;

    beforeEach(() => {
      userId = 'testId';
    });

    it('inserts a property, borrower and loan', () => {
      expect(Loans.find({}).count()).to.equal(0, 'loans 0');
      expect(Borrowers.find({}).count()).to.equal(0, 'borrowers 0');
      expect(Properties.find({}).count()).to.equal(0, 'properties 0');

      LoanService.adminLoanInsert({ userId });

      expect(Loans.find({}).count()).to.equal(1, 'loans 1');
      expect(Borrowers.find({}).count()).to.equal(1, 'borrowers 1');
      expect(Properties.find({}).count()).to.equal(1, 'properties 1');
    });

    it('adds the same userId on all 3 documents', () => {
      LoanService.adminLoanInsert({ userId });

      expect(Loans.findOne({}).userId).to.equal(userId, 'loans userId');
      expect(Borrowers.findOne({}).userId).to.equal(userId, 'borrowers userId');
      expect(Properties.findOne({}).userId).to.equal(
        userId,
        'properties userId',
      );
    });
  });

  describe('addNewStructure', () => {
    it('adds a new structure to a loan', () => {
      loanId = Factory.create('loan')._id;
      loan = LoanService.getLoanById(loanId);

      expect(loan.structures).to.deep.equal([]);

      LoanService.addNewStructure({ loanId });
      loan = LoanService.getLoanById(loanId);

      expect(loan.structures).to.have.length(1);
      expect(typeof loan.structures[0].id).to.equal('string');
    });

    it('selects the structure if it is the first one', () => {
      loanId = Factory.create('loan')._id;
      LoanService.addNewStructure({ loanId });

      loan = LoanService.getLoanById(loanId);
      expect(loan.selectedStructure).to.equal(loan.structures[0].id);
    });

    it('does not select the structure if it is not the first one', () => {
      loanId = Factory.create('loan', {
        structures: [{ id: 'first' }],
        selectedStructure: 'first',
      })._id;
      LoanService.addNewStructure({ loanId });

      loan = LoanService.getLoanById(loanId);
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

      loan = LoanService.getLoanById(loanId);

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

      loan = LoanService.getLoanById(loanId);

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
      loan = LoanService.getLoanById(loanId);

      expect(loan.structures.length).to.equal(2);

      const structureId = loan.structures[1].id;

      LoanService.removeStructure({ loanId, structureId });

      loan = LoanService.getLoanById(loanId);

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

      loan = LoanService.getLoanById(loanId);

      expect(loan.structures.length).to.equal(2);

      LoanService.removeStructure({
        loanId,
        structureId: loan.structures[1].id,
      });

      loan = LoanService.getLoanById(loanId);

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

      loan = LoanService.getLoanById(loanId);

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
      loan = LoanService.getLoanById(loanId);
      expect(loan.structures.propertyId).to.equal(undefined);
      LoanService.updateStructure({
        loanId,
        structureId,
        structure: { propertyId },
      });

      loan = LoanService.getLoanById(loanId);
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
      const { selectedStructure } = LoanService.getLoanById(loanId);

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

      loan = LoanService.getLoanById(loanId);

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

      loan = LoanService.getLoanById(loanId);

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
      loan = LoanService.getLoanById(loanId);

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
      loan = LoanService.getLoanById(loanId);

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
      loan = LoanService.getLoanById(loanId);
      expect(loan.structures[1].name).to.equal('Plan financier - copie');
    });
  });

  describe('getNewLoanName', () => {
    it('returns 18-0001 for the very first loan', () => {
      const name = LoanService.getNewLoanName();
      expect(name).to.equal('18-0001');
    });

    it('returns 18-0002 for the second loan', () => {
      loanId = LoanService.insert({ loan: {} });
      loan = LoanService.getLoanById(loanId);
      expect(loan.name).to.equal('18-0001');

      const name = LoanService.getNewLoanName();
      expect(name).to.equal('18-0002');
    });

    it('sorts loans properly 1', () => {
      Factory.create('loan', { name: '18-0009' });
      Factory.create('loan', { name: '18-0010' });

      const name = LoanService.getNewLoanName();
      expect(name).to.equal('18-0011');
    });

    it('sorts loans properly even if created in different order', () => {
      Factory.create('loan', { name: '18-0955' });
      Factory.create('loan', { name: '18-0153' });
      Factory.create('loan', { name: '18-0001' });

      const name = LoanService.getNewLoanName();
      expect(name).to.equal('18-0956');
    });

    it('returns 18-1234 for the nth loan', () => {
      Factory.create('loan', { name: '18-1233' });

      const name = LoanService.getNewLoanName();
      expect(name).to.equal('18-1234');
    });

    it('does not break if a 10000th loan is added', () => {
      Factory.create('loan', { name: '18-9999' });
      const name = LoanService.getNewLoanName();
      expect(name).to.equal('18-10000');
    });

    it('handles new year properly', () => {
      Factory.create('loan', { name: '18-0003' });
      const name = LoanService.getNewLoanName(new Date(2019, 1, 1));
      expect(name).to.equal('19-0001');
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
      loan = LoanService.getLoanById(loanId);

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
});
