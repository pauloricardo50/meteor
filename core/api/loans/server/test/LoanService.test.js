/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import { Loans, Borrowers, Properties } from '../../..';
import { stubCollections, generateData } from '../../../../utils/testHelpers';
import LoanService from '../../LoanService';

let loanId;
let loan;

describe('LoanService', () => {
  beforeEach(() => {
    resetDatabase();

    loanId = Factory.create('loan')._id;
    loan = LoanService.getLoanById(loanId);
  });

  describe('disableUserForms', () => {
    it('disables user forms', () => {
      LoanService.disableUserForms({ loanId });
      loan = LoanService.getLoanById(loanId);
      expect(loan.userFormsEnabled).to.equal(false);
    });
  });

  describe('enableUserForms', () => {
    it('enables the user forms', () => {
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

  describe('addStructure', () => {
    it('adds a new structure to a loan', () => {
      loanId = Factory.create('loan')._id;
      loan = LoanService.getLoanById(loanId);

      expect(loan.structures).to.deep.equal([]);

      LoanService.addStructure({ loanId });
      loan = LoanService.getLoanById(loanId);

      expect(loan.structures).to.have.length(1);
      expect(typeof loan.structures[0].id).to.equal('string');
    });

    it('selects the structure if it is the first one', () => {
      loanId = Factory.create('loan')._id;
      LoanService.addStructure({ loanId });

      loan = LoanService.getLoanById(loanId);
      expect(loan.selectedStructure).to.equal(loan.structures[0].id);
    });
  });

  describe('removeStructure', () => {
    it('removes an existing structure from a loan', () => {
      loanId = Factory.create('loan')._id;
      loan = LoanService.getLoanById(loanId);

      LoanService.addStructure({ loanId });
      LoanService.addStructure({ loanId });
      loan = LoanService.getLoanById(loanId);
      expect(loan.structures.length).to.equal(2);
      LoanService.selectStructure({
        loanId,
        structureId: loan.structures[1].id,
      });

      const structureId = loan.structures[0].id;

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
        LoanService.removeStructure({ loanId, structureId })).to.throw("Can't delete");
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
      expect(loan.structures.find(({ id }) => id === structureId)).to.deep.equal({ id: structureId, propertyId, loanTranches: [] });

      // Other structures are unaffected
      loan.structures
        .filter(({ id }) => id !== structureId)
        .forEach((structure, index) => {
          expect(structure).to.deep.equal({
            id: structureId + index,
            loanTranches: [],
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
      const { id: id1, ...structure1 } = loan.structures[0];
      const { id: id2, ...structure2 } = loan.structures[1];
      expect(id1).to.not.equal(id2);
      expect(structure1).to.deep.equal(structure2);
    });
  });
});
