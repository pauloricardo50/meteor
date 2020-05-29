/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';

import { expect } from 'chai';
import faker from 'faker/locale/fr';
import moment from 'moment';
import sinon from 'sinon';

import { PURCHASE_TYPE } from '../../../../redux/widget1/widget1Constants';
import { checkEmails, resetDatabase } from '../../../../utils/testHelpers';
import Analytics from '../../../analytics/server/Analytics';
import { OWN_FUNDS_TYPES } from '../../../borrowers/borrowerConstants';
import BorrowerService from '../../../borrowers/server/BorrowerService';
import { EMAIL_IDS } from '../../../email/emailConstants';
import generator from '../../../factories/server';
import { INTEREST_RATES } from '../../../interestRates/interestRatesConstants';
import LenderService from '../../../lenders/server/LenderService';
import { ddpWithUserId } from '../../../methods/methodHelpers';
import OfferService from '../../../offers/server/OfferService';
import {
  ORGANISATION_FEATURES,
  ORGANISATION_TYPES,
} from '../../../organisations/organisationConstants';
import { generateOrganisationsWithLenderRules } from '../../../organisations/server/test/testHelpers.test';
import {
  PROPERTY_CATEGORY,
  RESIDENCE_TYPE,
} from '../../../properties/propertyConstants';
import PropertyService from '../../../properties/server/PropertyService';
import {
  REVENUE_STATUS,
  REVENUE_TYPES,
} from '../../../revenues/revenueConstants';
import SlackService from '../../../slack/server/SlackService';
import TaskService from '../../../tasks/server/TaskService';
import UserService from '../../../users/server/UserService';
import { LOAN_CATEGORIES, LOAN_STATUS, STEPS } from '../../loanConstants';
import {
  loanSetAdminNote,
  loanSetStatus,
  sendNegativeFeedbackToAllLenders,
  setLoanStep,
} from '../../methodDefinitions';
import LoanService from '../LoanService';
import { generateDisbursedSoonLoansTasks } from '../methods';

describe.only('LoanService', function() {
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
      loan = LoanService.get(loanId, { contacts: 1 });
      expect(loan.contacts.length).to.equal(1);

      LoanService.popValue({ loanId, object: { contacts: 1 } });

      loan = LoanService.get(loanId, { contacts: 1 });
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

  describe('fullLoanInsert', () => {
    let userId;

    beforeEach(() => {
      userId = 'testId';
    });

    it('inserts a loan', () => {
      expect(LoanService.countAll()).to.equal(0, 'loans 0');

      LoanService.fullLoanInsert({ userId });

      expect(LoanService.countAll()).to.equal(1, 'loans 1');
    });

    it('adds userId', () => {
      LoanService.fullLoanInsert({ userId });

      expect(LoanService.get({}, { userId: 1 }).userId).to.equal(
        userId,
        'loans userId',
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

      loan = LoanService.get('loanId', { structures: { propertyId: 1 } });

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

      loan = LoanService.get('loanId', {
        structures: { propertyId: 1, promotionOptionId: 1 },
      });

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
      loan = LoanService.get(loanId, { structures: 1 });

      expect(loan.structures).to.deep.equal([]);

      LoanService.addNewStructure({ loanId });
      loan = LoanService.get(loanId, { structures: { id: 1 } });

      expect(loan.structures).to.have.length(1);
      expect(typeof loan.structures[0].id).to.equal('string');
    });

    it('selects the structure if it is the first one', () => {
      loanId = Factory.create('loan')._id;
      LoanService.addNewStructure({ loanId });

      loan = LoanService.get(loanId, {
        selectedStructure: 1,
        structures: { id: 1 },
      });
      expect(loan.selectedStructure).to.equal(loan.structures[0].id);
    });

    it('does not select the structure if it is not the first one', () => {
      loanId = Factory.create('loan', {
        structures: [{ id: 'first' }],
        selectedStructure: 'first',
      })._id;
      LoanService.addNewStructure({ loanId });

      loan = LoanService.get(loanId, { selectedStructure: 1 });
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

      loan = LoanService.get(loanId, { structures: 1 });

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

      loan = LoanService.get(loanId, { structures: 1 });

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
      loan = LoanService.get(loanId, { structures: 1 });

      expect(loan.structures.length).to.equal(2);

      const structureId = loan.structures[1].id;

      LoanService.removeStructure({ loanId, structureId });

      loan = LoanService.get(loanId, { structures: 1 });

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
        LoanService.removeStructure({ loanId, structureId }),
      ).to.throw('pouvez pas');
    });

    it('removes a duplicate structure', () => {
      loanId = Factory.create('loan', {
        structures: [{ id: '1' }],
        selectedStructure: '1',
      })._id;

      LoanService.duplicateStructure({ loanId, structureId: '1' });

      loan = LoanService.get(loanId, { structures: 1 });

      expect(loan.structures.length).to.equal(2);

      LoanService.removeStructure({
        loanId,
        structureId: loan.structures[1].id,
      });

      loan = LoanService.get(loanId, { structures: 1 });

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

      loan = LoanService.get(loanId, { structures: 1 });

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
      loan = LoanService.get(loanId, { structures: 1 });
      expect(loan.structures.propertyId).to.equal(undefined);
      LoanService.updateStructure({
        loanId,
        structureId,
        structure: { propertyId },
      });

      loan = LoanService.get(loanId, { structures: 1 });
      // This structure is correct
      expect(
        loan.structures.find(({ id }) => id === structureId),
      ).to.deep.include({ id: structureId, propertyId });

      // Other structures are unaffected
      loan.structures
        .filter(({ id }) => id !== structureId)
        .forEach((structure, index) => {
          expect(structure).to.deep.include({
            id: structureId + index,
          });
        });
    });

    it('updates the loan tranches if the wanted loan changed and there is only one tranche', () => {
      loanId = Factory.create('loan', {
        structures: [
          {
            id: 'structure',
            wantedLoan: 1000000,
            loanTranches: [{ value: 1000000, type: INTEREST_RATES.YEARS_10 }],
          },
        ],
      })._id;

      LoanService.updateStructure({
        loanId,
        structureId: 'structure',
        structure: { wantedLoan: 800000 },
      });

      const { structures = [] } = LoanService.get(loanId, { structures: 1 });
      const [structure] = structures;
      expect(structure.loanTranches[0].value).to.equal(800000);
    });

    it('does not update the loan tranches if the wanted loan changed and there is more than one tranche', () => {
      loanId = Factory.create('loan', {
        structures: [
          {
            id: 'structure',
            wantedLoan: 1000000,
            loanTranches: [
              { value: 500000, type: INTEREST_RATES.YEARS_5 },
              { value: 500000, type: INTEREST_RATES.YEARS_10 },
            ],
          },
        ],
      })._id;

      LoanService.updateStructure({
        loanId,
        structureId: 'structure',
        structure: { wantedLoan: 800000 },
      });

      const { structures = [] } = LoanService.get(loanId, { structures: 1 });
      const [structure] = structures;
      expect(structure.loanTranches.length).to.equal(2);
      expect(structure.loanTranches[0].value).to.equal(500000);
      expect(structure.loanTranches[1].value).to.equal(500000);
    });

    it('does not update the loan tranches if the wanted loan did not change', () => {
      loanId = Factory.create('loan', {
        structures: [
          {
            id: 'structure',
            wantedLoan: 1000000,
            loanTranches: [{ value: 1000000, type: INTEREST_RATES.YEARS_10 }],
          },
        ],
      })._id;

      LoanService.updateStructure({
        loanId,
        structureId: 'structure',
        structure: { propertyId: 'prop' },
      });

      const { structures = [] } = LoanService.get(loanId, { structures: 1 });
      const [structure] = structures;
      expect(structure.loanTranches[0].value).to.equal(1000000);
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
      const { selectedStructure } = LoanService.get(loanId, {
        selectedStructure: 1,
      });

      expect(selectedStructure).to.equal(structureId2);
    });

    it('throws if the structure does not exist', () => {
      loanId = Factory.create('loan')._id;
      const badId = 'inexistentId';

      expect(() =>
        LoanService.selectStructure({ loanId, structureId: badId }),
      ).to.throw(badId);
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

      loan = LoanService.get(loanId, { structures: 1 });

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

      loan = LoanService.get(loanId, { structures: 1 });

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
      loan = LoanService.get(loanId, { structures: { name: 1 } });

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
      loan = LoanService.get(loanId, { structures: { name: 1 } });

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
      loan = LoanService.get(loanId, { structures: { name: 1 } });
      expect(loan.structures[1].name).to.equal('Plan financier - copie');
    });
  });

  describe('loan name regEx', () => {
    it('allows loan names with correct format', () => {
      expect(() => Factory.create('loan', { name: '18-0202' })).to.not.throw();
    });

    it('does not allow loan names with incorrect format', () => {
      expect(() => Factory.create('loan', { name: '18-202' })).to.throw(
        'regular expression',
      );
      expect(() => Factory.create('loan', { name: '202' })).to.throw(
        'regular expression',
      );
      expect(() => Factory.create('loan', { name: '1-202' })).to.throw(
        'regular expression',
      );
      expect(() => Factory.create('loan', { name: '18202' })).to.throw(
        'regular expression',
      );
      expect(() => Factory.create('loan', { name: '0202' })).to.throw(
        'regular expression',
      );
      expect(() => Factory.create('loan', { name: 'abc' })).to.throw(
        'regular expression',
      );
      expect(() => Factory.create('loan', { name: '18-a202' })).to.throw(
        'regular expression',
      );
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
      loan = LoanService.get(loanId, { structures: 1 });

      expect(loan.structures[0].ownFunds.length).to.equal(1);
      expect(loan.structures[0].ownFunds[0].borrowerId).to.equal(borrowerId2);
    });
  });

  describe('switchBorrower', () => {
    it('switches a borrowerId with a new one', () => {
      const oldBorrowerId = Factory.create('borrower')._id;
      const borrowerId = Factory.create('borrower')._id;
      loanId = Factory.create('loan', { borrowerIds: [oldBorrowerId] })._id;
      loan = LoanService.get(loanId, { borrowerIds: 1 });

      expect(loan.borrowerIds).to.deep.equal([oldBorrowerId]);

      LoanService.switchBorrower({ loanId, oldBorrowerId, borrowerId });

      loan = LoanService.get(loanId, { borrowerIds: 1 });

      expect(loan.borrowerIds).to.deep.equal([borrowerId]);
    });

    it('switches a borrowerId with a new one with multiple borrowers', () => {
      const oldBorrowerId = Factory.create('borrower')._id;
      const borrowerId = Factory.create('borrower')._id;
      loanId = Factory.create('loan', { borrowerIds: [oldBorrowerId, 'dude'] })
        ._id;
      loan = LoanService.get(loanId, { borrowerIds: 1 });

      expect(loan.borrowerIds).to.deep.equal([oldBorrowerId, 'dude']);

      LoanService.switchBorrower({ loanId, oldBorrowerId, borrowerId });

      loan = LoanService.get(loanId, { borrowerIds: 1 });

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
        LoanService.switchBorrower({ loanId, oldBorrowerId, borrowerId }),
      ).to.throw('déjà');
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

      expect(LoanService.get(loanId, { userId: 1 }).userId).to.equal(userId);
      expect(BorrowerService.get(borrowerId1, { userId: 1 }).userId).to.equal(
        userId,
      );
      expect(BorrowerService.get(borrowerId2, { userId: 1 }).userId).to.equal(
        userId,
      );
      expect(PropertyService.get(propertyId1, { userId: 1 }).userId).to.equal(
        userId,
      );
      expect(PropertyService.get(propertyId2, { userId: 1 }).userId).to.equal(
        userId,
      );
    });

    it('throws if a borrower is assigned to multiple loans', () => {
      generator({
        loans: [
          { _id: 'loanId', borrowers: { _id: 'borr1' } },
          { borrowers: [{ _id: 'borr1' }, {}] },
        ],
      });

      expect(() =>
        LoanService.assignLoanToUser({ loanId: 'loanId', userId: 'dude' }),
      ).to.throw('emprunteur');
    });

    it('throws if a property is assigned to multiple loans', () => {
      generator({
        loans: [
          { _id: 'loanId', properties: { _id: 'propId1' } },
          { properties: [{ _id: 'propId1' }, {}] },
        ],
      });

      expect(() =>
        LoanService.assignLoanToUser({ loanId: 'loanId', userId: 'dude' }),
      ).to.throw('bien immobilier');
    });

    it('does not throw for a PRO property, and assigns only USER properties', () => {
      generator({
        loans: [
          { properties: { _id: 'propId1', category: PROPERTY_CATEGORY.PRO } },
          {
            _id: 'loanId',
            properties: [{ _id: 'propId2' }, { _id: 'propId1' }],
          },
        ],
      });

      expect(() =>
        LoanService.assignLoanToUser({ loanId: 'loanId', userId: 'dude' }),
      ).to.not.throw();
      expect(PropertyService.get('propId1', { userId: 1 }).userId).to.equal(
        undefined,
      );
      expect(PropertyService.get('propId2', { userId: 1 }).userId).to.equal(
        'dude',
      );
    });

    it('refers a user if this is his first loan', () => {
      generator({
        users: [
          { _id: 'userId' },
          {
            _id: 'proId',
            _factory: 'pro',
            organisations: { _id: 'orgId', $metadata: { isMain: true } },
          },
        ],
        loans: { _id: 'loanId', referralId: 'proId' },
      });

      LoanService.assignLoanToUser({ loanId: 'loanId', userId: 'userId' });

      const user = UserService.get('userId', {
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
      });

      expect(user).to.deep.include({
        referredByUserLink: 'proId',
        referredByOrganisationLink: 'orgId',
      });
    });

    it('refers a user by an organisation if it is not already set', () => {
      generator({
        users: [
          { _id: 'userId' },
          {
            _id: 'proId',
            _factory: 'pro',
            organisations: { _id: 'orgId' },
          },
        ],
        loans: { _id: 'loanId', referralId: 'orgId' },
      });

      LoanService.assignLoanToUser({ loanId: 'loanId', userId: 'userId' });

      const user = UserService.get('userId', {
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
      });

      expect(user).to.deep.include({
        referredByOrganisationLink: 'orgId',
      });
    });

    it('does not change referredBy if it is already set', () => {
      generator({
        users: [
          { _id: 'userId', referredByUser: { _id: 'proId1' } },
          {
            _id: 'proId2',
            _factory: 'pro',
            organisations: { _id: 'orgId' },
          },
        ],
        loans: { _id: 'loanId', referralId: 'proId2' },
      });

      LoanService.assignLoanToUser({ loanId: 'loanId', userId: 'userId' });

      const user = UserService.get('userId', {
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
      });

      expect(user).to.deep.include({
        _id: 'userId',
        referredByUserLink: 'proId1',
      });
    });

    it('sets the assignee on a loan if there was none', () => {
      generator({
        loans: { _id: 'loanId' },
        users: { _id: 'userId', assignedEmployee: { _id: 'adminId' } },
      });

      LoanService.assignLoanToUser({ loanId: 'loanId', userId: 'userId' });

      loan = LoanService.get('loanId', { assigneeLinks: 1 });

      expect(loan.assigneeLinks).to.deep.equal([
        { _id: 'adminId', percent: 100, isMain: true },
      ]);
    });

    it('sets the assignee on a loan if there was none and user changes', () => {
      generator({
        loans: { _id: 'loanId', user: { _id: 'user1' } },
        users: { _id: 'user2', assignedEmployee: { _id: 'adminId' } },
      });

      LoanService.assignLoanToUser({ loanId: 'loanId', userId: 'user2' });

      loan = LoanService.get('loanId', { assigneeLinks: 1 });

      expect(loan.assigneeLinks).to.deep.equal([
        { _id: 'adminId', percent: 100, isMain: true },
      ]);
    });

    it('does not set a new assignee if there was already one', () => {
      generator({
        loans: {
          _id: 'loanId',
          assignees: {
            _id: 'admin1',
            $metadata: { percent: 100, isMain: true },
          },
        },
        users: { _id: 'userId', assignedEmployee: { _id: 'admin2' } },
      });

      LoanService.assignLoanToUser({ loanId: 'loanId', userId: 'userId' });

      loan = LoanService.get('loanId', { assigneeLinks: 1 });

      expect(loan.assigneeLinks).to.deep.equal([
        { _id: 'admin1', percent: 100, isMain: true },
      ]);
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
          { _id: 'adminId', _factory: 'admin' },
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

    it('sends a negative feedback to all lenders', async () => {
      const numberOfLenders = 5;
      const numberOfOffersPerLender = 1;

      const offerIds = insertMultipleOffers({
        loanId,
        numberOfLenders,
        numberOfOffersPerLender,
      });

      expect(offerIds.length).to.equal(
        numberOfLenders * numberOfOffersPerLender,
      );

      await ddpWithUserId('adminId', () =>
        sendNegativeFeedbackToAllLenders.run({ loanId }),
      );

      const emails = await checkEmails(numberOfLenders);

      expect(emails.length).to.equal(numberOfLenders);
      addresses.forEach(email =>
        expect(emails.some(({ address }) => address === email)).to.equal(true),
      );
    });

    it('sends a negative feedback to all lenders once only', async () => {
      const numberOfLenders = 5;
      const numberOfOffersPerLender = 10;

      const offerIds = insertMultipleOffers({
        loanId,
        numberOfLenders,
        numberOfOffersPerLender,
      });

      expect(offerIds.length).to.equal(
        numberOfLenders * numberOfOffersPerLender,
      );

      await ddpWithUserId('adminId', () =>
        sendNegativeFeedbackToAllLenders.run({ loanId }),
      );

      const emails = await checkEmails(numberOfLenders);

      expect(emails.length).to.equal(numberOfLenders);
      addresses.forEach(email =>
        expect(emails.some(({ address }) => address === email)).to.equal(true),
      );
    });

    it('does not send any feedback if there is no lender', async () => {
      await ddpWithUserId('adminId', () =>
        sendNegativeFeedbackToAllLenders.run({ loanId }),
      );

      const emails = await checkEmails(1, { timeout: 2000, noExpect: true });

      expect(emails.length).to.equal(0);
    });

    it('does not send any feedback if there is no offer', async () => {
      const numberOfLenders = 5;
      const numberOfOffersPerLender = 0;

      const offerIds = insertMultipleOffers({
        loanId,
        numberOfLenders,
        numberOfOffersPerLender,
      });

      expect(offerIds.length).to.equal(0);

      await ddpWithUserId('adminId', () =>
        sendNegativeFeedbackToAllLenders.run({ loanId }),
      );

      const emails = await checkEmails(1, { timeout: 2000, noExpect: true });

      expect(emails.length).to.equal(0);
    });
  });

  describe('setStep', () => {
    it('sets the step', () => {
      generator({
        loans: { _id: 'id', step: STEPS.SOLVENCY },
      });

      LoanService.setStep({ loanId: 'id', nextStep: STEPS.REQUEST });

      loan = LoanService.get('id', { step: 1 });

      expect(loan.step).to.equal(STEPS.REQUEST);
    });

    it('sends a notification email if the step goes from SOLVENCY to OFFERS', async () => {
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
          },
          assignees: { _id: 'admin', $metadata: { isMain: true } },
        },
      });

      await ddpWithUserId('admin', () =>
        setLoanStep.run({ loanId: 'myLoan', nextStep: STEPS.OFFERS }),
      );

      loan = LoanService.get('myLoan', { step: 1 });

      expect(loan.step).to.equal(STEPS.OFFERS);

      const [
        {
          emailId,
          address,
          response: { status },
          template: {
            message: { from_email, subject, global_merge_vars, from_name },
          },
        },
      ] = await checkEmails(1);

      expect(status).to.equal('sent');
      expect(emailId).to.equal(EMAIL_IDS.FIND_LENDER_NOTIFICATION);
      expect(address).to.equal('john@doe.com');
      expect(from_email).to.equal('team@e-potek.ch');
      expect(from_name).to.equal('e-Potek');
      expect(subject).to.include('[e-Potek] Identifiez votre prêteur');
      expect(
        global_merge_vars.find(({ name }) => name === 'CTA_URL').content,
      ).to.include('/loans/myLoan');
      expect(
        global_merge_vars.find(({ name }) => name === 'BODY').content,
      ).to.include('Admin User');
    });

    it('sends a notification email if the step goes from REQUEST to OFFERS', async () => {
      generator({
        users: { _id: 'admin', _factory: 'admin' },
        loans: {
          _id: 'myLoan',
          step: STEPS.REQUEST,
          user: {
            emails: [{ address: 'john@doe.com', verified: false }],
          },
          assignees: { _id: 'admin', $metadata: { isMain: true } },
        },
      });

      await ddpWithUserId('admin', () =>
        setLoanStep.run({ loanId: 'myLoan', nextStep: STEPS.OFFERS }),
      );

      const [
        {
          emailId,
          response: { status },
        },
      ] = await checkEmails(1);

      expect(status).to.equal('sent');
      expect(emailId).to.equal(EMAIL_IDS.FIND_LENDER_NOTIFICATION);
    });

    it('does not send a notification email if the step goes from REQUEST to OFFERS', async () => {
      generator({
        users: { _id: 'admin', _factory: 'admin' },
        loans: {
          _id: 'myLoan',
          step: STEPS.CLOSING,
          user: { emails: [{ address: 'john@doe.com', verified: false }] },
        },
      });

      await ddpWithUserId('admin', () =>
        setLoanStep.run({ loanId: 'myLoan', nextStep: STEPS.OFFERS }),
      );

      const emails = await checkEmails(1, { timeout: 2000, noExpect: true });

      expect(emails.length).to.equal(0);
    });
  });

  describe('setStatus', () => {
    it('returns the old and new status for analytics', () => {
      generator({
        loans: { _id: 'myLoan', status: LOAN_STATUS.CLOSING },
      });

      const result = LoanService.setStatus({
        loanId: 'myLoan',
        status: LOAN_STATUS.BILLING,
      });

      expect(result).to.deep.equal({
        prevStatus: LOAN_STATUS.CLOSING,
        nextStatus: LOAN_STATUS.BILLING,
      });
    });

    it('the method calls analytics', () => {
      const spy = sinon.spy();
      sinon.stub(Analytics.prototype, 'track').callsFake(spy);
      generator({
        loans: {
          _id: 'myLoan',
          status: LOAN_STATUS.LEAD,
          name: '20-0001',
          user: {
            _id: 'customerId',
            firstName: 'Customer',
            lastName: '1',
            referredByOrganisation: { name: 'Org 1' },
            referredByUser: { firstName: 'Pro', lastName: '1' },
          },
          assignees: {
            _id: 'adminId1',
            _factory: 'admin',
            firstName: 'Admin',
            lastName: '1',
            $metadata: { isMain: true },
          },
        },
        users: [
          {
            _id: 'adminId2',
            _factory: 'admin',
            firstName: 'Admin',
            lastName: '2',
          },
        ],
      });

      return ddpWithUserId('adminId2', () =>
        loanSetStatus.run({
          loanId: 'myLoan',
          status: LOAN_STATUS.QUALIFIED_LEAD,
        }),
      )
        .then(result => {
          expect(result).to.deep.equal({
            prevStatus: LOAN_STATUS.LEAD,
            nextStatus: LOAN_STATUS.QUALIFIED_LEAD,
          });

          expect(spy.calledOnce).to.equal(true);
          expect(spy.args[0][0]).to.equal('LOAN_STATUS_CHANGED');
          expect(spy.args[0][1]).to.deep.equal({
            adminId: 'adminId2',
            adminName: 'Admin 2',
            assigneeId: 'adminId1',
            assigneeName: 'Admin 1',
            customerId: 'customerId',
            customerName: 'Customer 1',
            loanCategory: LOAN_CATEGORIES.STANDARD,
            loanId: 'myLoan',
            loanName: '20-0001',
            loanPurchaseType: PURCHASE_TYPE.ACQUISITION,
            loanResidenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
            loanStep: STEPS.SOLVENCY,
            nextStatus: LOAN_STATUS.QUALIFIED_LEAD,
            prevStatus: LOAN_STATUS.LEAD,
            referredByOrganisation: 'Org 1',
            referredByUser: 'Pro 1',
          });
        })
        .finally(() => {
          Analytics.prototype.track.restore();
        });
    });

    it('does not allow to change to the same status', () => {
      generator({
        loans: { _id: 'myLoan', status: LOAN_STATUS.ONGOING },
      });

      expect(() =>
        LoanService.setStatus({
          loanId: 'myLoan',
          status: LOAN_STATUS.ONGOING,
        }),
      ).to.throw('le même');
    });

    it('allows one step forward status change', () => {
      generator({
        loans: { _id: 'myLoan', status: LOAN_STATUS.ONGOING },
      });

      expect(() =>
        LoanService.setStatus({
          loanId: 'myLoan',
          status: LOAN_STATUS.CLOSING,
        }),
      ).to.not.throw();
    });

    it('allows one step backward status change', () => {
      generator({
        loans: { _id: 'myLoan', status: LOAN_STATUS.ONGOING },
      });

      expect(() =>
        LoanService.setStatus({
          loanId: 'myLoan',
          status: LOAN_STATUS.QUALIFIED_LEAD,
        }),
      ).to.not.throw();
    });

    it('allows resurrections from UNSUCCESSFUL', () => {
      generator({
        loans: { _id: 'myLoan', status: LOAN_STATUS.UNSUCCESSFUL },
      });

      expect(() =>
        LoanService.setStatus({
          loanId: 'myLoan',
          status: LOAN_STATUS.QUALIFIED_LEAD,
        }),
      ).to.not.throw();
    });

    it('allows resurrections from PENDING', () => {
      generator({
        loans: { _id: 'myLoan', status: LOAN_STATUS.PENDING },
      });

      expect(() =>
        LoanService.setStatus({
          loanId: 'myLoan',
          status: LOAN_STATUS.QUALIFIED_LEAD,
        }),
      ).to.not.throw();
    });

    it('allows resurrections from TEST', () => {
      generator({
        loans: { _id: 'myLoan', status: LOAN_STATUS.TEST },
      });

      expect(() =>
        LoanService.setStatus({
          loanId: 'myLoan',
          status: LOAN_STATUS.QUALIFIED_LEAD,
        }),
      ).to.not.throw();
    });

    it('allows killings to UNSUCCESSFUL', () => {
      generator({
        loans: { _id: 'myLoan', status: LOAN_STATUS.QUALIFIED_LEAD },
      });

      expect(() =>
        LoanService.setStatus({
          loanId: 'myLoan',
          status: LOAN_STATUS.UNSUCCESSFUL,
        }),
      ).to.not.throw();
    });

    it('allows killings to PENDING', () => {
      generator({
        loans: { _id: 'myLoan', status: LOAN_STATUS.QUALIFIED_LEAD },
      });

      expect(() =>
        LoanService.setStatus({
          loanId: 'myLoan',
          status: LOAN_STATUS.PENDING,
        }),
      ).to.not.throw();
    });

    it('allows killings to TEST', () => {
      generator({
        loans: { _id: 'myLoan', status: LOAN_STATUS.QUALIFIED_LEAD },
      });

      expect(() =>
        LoanService.setStatus({
          loanId: 'myLoan',
          status: LOAN_STATUS.TEST,
        }),
      ).to.not.throw();
    });

    it('does not allow 2 steps forward status change', () => {
      generator({
        loans: { _id: 'myLoan', status: LOAN_STATUS.LEAD },
      });

      expect(() =>
        LoanService.setStatus({
          loanId: 'myLoan',
          status: LOAN_STATUS.ONGOING,
        }),
      ).to.throw('Vous ne pouvez pas');
    });

    it('does not allow 2 steps backward status change', () => {
      generator({
        loans: { _id: 'myLoan', status: LOAN_STATUS.BILLING },
      });

      expect(() =>
        LoanService.setStatus({
          loanId: 'myLoan',
          status: LOAN_STATUS.ONGOING,
        }),
      ).to.throw('Vous ne pouvez pas');
    });

    it('does not allow overflows', () => {
      generator({
        loans: { _id: 'myLoan', status: LOAN_STATUS.FINALIZED },
      });

      expect(() =>
        LoanService.setStatus({
          loanId: 'myLoan',
          status: LOAN_STATUS.LEAD,
        }),
      ).to.throw('Vous ne pouvez pas');
    });

    it('does not allow undeflows', () => {
      generator({
        loans: { _id: 'myLoan', status: LOAN_STATUS.LEAD },
      });

      expect(() =>
        LoanService.setStatus({
          loanId: 'myLoan',
          status: LOAN_STATUS.FINALIZED,
        }),
      ).to.throw('Vous ne pouvez pas');
    });
  });

  describe.only('getLoanCalculator', () => {
    it('returns an uninitialized calculator by default', () => {
      generator({ loans: { _id: 'myLoan' } });

      const calc = LoanService.getLoanCalculator({ loanId: 'myLoan' });

      expect(calc.organisationName).to.equal(undefined);
    });

    it('initializes a calculator if an offer has been chosen', () => {
      generator({
        loans: {
          _id: 'myLoan',
          lenders: {
            organisation: { name: 'Org1', lenderRules: {} },
            offers: { _id: 'offerId' },
          },
          structures: [{ offerId: 'offerId', id: 'struct' }],
          selectedStructure: 'struct',
        },
      });

      const calc = LoanService.getLoanCalculator({ loanId: 'myLoan' });

      expect(calc.organisationName).to.equal('Org1');
    });

    it('initializes a calculator if a promotion has a lenderOrganisation on it', () => {
      generator({
        loans: {
          _id: 'myLoan',
          promotions: {
            lenderOrganisation: { name: 'Org2', lenderRules: {} },
          },
        },
      });

      const calc = LoanService.getLoanCalculator({ loanId: 'myLoan' });

      expect(calc.organisationName).to.equal('Org2');
    });
  });

  describe('setMaxPropertyValueOrBorrowRatio', function() {
    this.timeout(10000);

    it('finds the ideal borrowRatio', () => {
      generator({
        loans: {
          _id: 'loanId',
          purchaseType: PURCHASE_TYPE.ACQUISITION,
          borrowers: {
            bankFortune: [{ value: 500000 }],
            salary: 1000000,
            insurance2: [{ value: 100000 }],
          },
        },
        organisations: [
          ...generateOrganisationsWithLenderRules({
            number: 5,
            mainBorrowRatio: { min: 0.65, max: 0.9 },
            secondaryBorrowRatio: { min: 0.5, max: 0.7 },
          }),
          {
            name: 'no lender rules',
            type: ORGANISATION_TYPES.BANK,
            features: [ORGANISATION_FEATURES.LENDER],
          },
        ],
      });

      LoanService.setMaxPropertyValueOrBorrowRatio({
        loanId: 'loanId',
        canton: 'GE',
      });

      const {
        maxPropertyValue: { canton, date, main, second },
      } = LoanService.get('loanId', { maxPropertyValue: 1 });

      expect(canton).to.equal('GE');
      expect(moment(date).format('YYYY-MM-DD')).to.equal(
        moment().format('YYYY-MM-DD'),
      );
      expect(main.min.borrowRatio).to.equal(0.65);
      expect(main.min.propertyValue).to.equal(1496000);
      expect(main.max.borrowRatio).to.equal(0.835);
      expect(main.max.propertyValue).to.equal(2761000);
      expect(second.min.borrowRatio).to.equal(0.5);
      expect(second.min.propertyValue).to.equal(909000);
      expect(second.max.borrowRatio).to.equal(0.65);
      expect(second.max.propertyValue).to.equal(1245000);
    });

    it('Only uses the promotion lender', () => {
      generator({
        loans: {
          _id: 'loanId',
          borrowers: {
            bankFortune: [{ value: 500000 }],
            salary: 1000000,
            insurance2: [{ value: 100000 }],
          },
          promotions: {
            lenderOrganisation: generateOrganisationsWithLenderRules({
              number: 1,
              mainBorrowRatio: { min: 0.75, max: 0.75 },
              secondaryBorrowRatio: { min: 0.7, max: 0.7 },
            }),
          },
        },
      });

      LoanService.setMaxPropertyValueOrBorrowRatio({
        loanId: 'loanId',
        canton: 'GE',
      });

      const {
        maxPropertyValue: { canton, date, main, second },
      } = LoanService.get('loanId', { maxPropertyValue: 1 });

      expect(canton).to.equal('GE');
      expect(moment(date).format('YYYY-MM-DD')).to.equal(
        moment().format('YYYY-MM-DD'),
      );
      expect(main.min).to.equal(undefined);
      expect(main.max.borrowRatio).to.equal(0.75);
      expect(main.max.propertyValue).to.equal(1988000);
      expect(second.min).to.equal(undefined);
      expect(second.max.borrowRatio).to.equal(0.7);
      expect(second.max.propertyValue).to.equal(1420000);
    });

    it('calculates the max borrow ratio for refinancings', () => {
      generator({
        loans: {
          _id: 'loanId',
          purchaseType: PURCHASE_TYPE.REFINANCING,
          borrowers: {
            bankFortune: [{ value: 500000 }],
            salary: 1000000,
            insurance2: [{ value: 100000 }],
          },
          properties: {
            value: 1000000,
          },
          previousLoanTranches: [
            { value: 600000, rate: 0.01, dueDate: new Date() },
          ],
        },
        organisations: [
          ...generateOrganisationsWithLenderRules({
            number: 5,
            mainBorrowRatio: { min: 0.65, max: 0.9 },
            secondaryBorrowRatio: { min: 0.5, max: 0.7 },
          }),
          {
            name: 'no lender rules',
            type: ORGANISATION_TYPES.BANK,
            features: [ORGANISATION_FEATURES.LENDER],
          },
        ],
      });

      LoanService.setMaxPropertyValueOrBorrowRatio({
        loanId: 'loanId',
        canton: 'GE',
      });

      const {
        maxPropertyValue: { canton, date, main, second },
      } = LoanService.get('loanId', { maxPropertyValue: 1 });

      expect(main.min.borrowRatio).to.equal(0.65);
      expect(main.min.propertyValue).to.equal(1000000);
      expect(main.max.borrowRatio).to.equal(0.8375);
      expect(main.max.propertyValue).to.equal(1000000);
      expect(second.min.borrowRatio).to.equal(0.5);
      expect(second.min.propertyValue).to.equal(1000000);
      expect(second.max.borrowRatio).to.equal(0.65);
      expect(second.max.propertyValue).to.equal(1000000);
    });
  });

  describe('expireAnonymousLoans', () => {
    it('does not update any unmatched loans', () => {
      generator({
        loans: [
          { anonymous: true },
          { anonymous: true, status: LOAN_STATUS.UNSUCCESSFUL },
        ],
      });

      expect(LoanService.expireAnonymousLoans()).to.equal(0);
    });

    it('only updates loans from more than a week ago', async () => {
      const promises = [];
      for (let index = 0; index < 10; index++) {
        promises.push(
          LoanService.rawCollection.insert({
            anonymous: true,
            updatedAt: moment()
              .subtract(index, 'days')
              .toDate(),
            _id: index,
            name: index,
          }),
        );
      }

      await Promise.all(promises);

      expect(LoanService.expireAnonymousLoans()).to.equal(5);
    });

    it('does not update loans already at UNSUCCESSFUL status', async () => {
      await LoanService.rawCollection.insert({
        anonymous: true,
        updatedAt: moment()
          .subtract(10, 'days')
          .toDate(),
        _id: 'a',
        name: 'b',
        status: LOAN_STATUS.UNSUCCESSFUL,
      });

      expect(LoanService.expireAnonymousLoans()).to.equal(0);
    });
  });

  describe('insertAnonymousLoan', () => {
    it('inserts an anonymous loan', () => {
      LoanService.insertAnonymousLoan({ referralId: 'someId' });

      expect(
        LoanService.get(
          {},
          { anonymous: 1, displayWelcomeScreen: 1, referralId: 1 },
        ),
      ).to.deep.include({
        anonymous: true,
        displayWelcomeScreen: false,
        referralId: 'someId',
      });
    });

    it('creates a link with a property if provided', () => {
      generator({ properties: { _id: 'propertyId' } });
      LoanService.insertAnonymousLoan({ proPropertyId: 'propertyId' });

      expect(LoanService.get({}, { propertyIds: 1 })).to.deep.include({
        propertyIds: ['propertyId'],
      });
    });
  });

  describe('setAdminNote', () => {
    it('adds new adminNotes to a loan', () => {
      generator({ loans: { _id: 'loanId' }, users: { _id: 'userId' } });

      LoanService.setAdminNote({
        loanId: 'loanId',
        userId: 'userId',
        note: { note: 'hello' },
      });

      LoanService.setAdminNote({
        loanId: 'loanId',
        userId: 'userId',
        note: { note: 'world' },
      });

      const { adminNotes } = LoanService.get('loanId', { adminNotes: 1 });
      expect(adminNotes.length).to.equal(2);
      expect(adminNotes[0].note).to.equal('world');
      expect(adminNotes[1].note).to.equal('hello');
    });

    it('updates an adminNote', () => {
      generator({ loans: { _id: 'loanId' }, users: { _id: 'userId' } });

      const now = new Date();
      LoanService.setAdminNote({
        loanId: 'loanId',
        userId: 'userId',
        note: { note: 'hello', date: now },
      });
      const { adminNotes } = LoanService.get('loanId', { adminNotes: 1 });

      LoanService.setAdminNote({
        loanId: 'loanId',
        userId: 'userId',
        note: { note: 'hello world' },
        adminNoteId: adminNotes[0].id,
      });

      const { adminNotes: updated } = LoanService.get('loanId', {
        adminNotes: 1,
      });
      expect(updated[0].note).to.equal('hello world');
      expect(updated[0].date.getTime()).to.be.above(now.getTime());
    });

    it('sorts notes from newest to oldest', () => {
      generator({ loans: { _id: 'loanId' }, users: { _id: 'userId' } });
      LoanService.setAdminNote({
        loanId: 'loanId',
        userId: 'userId',
        note: {
          note: '1',
          date: moment()
            .subtract(3, 'd')
            .toDate(),
        },
      });
      LoanService.setAdminNote({
        loanId: 'loanId',
        userId: 'userId',
        note: {
          note: '2',
          date: moment()
            .subtract(2, 'd')
            .toDate(),
        },
      });
      LoanService.setAdminNote({
        loanId: 'loanId',
        userId: 'userId',
        note: {
          note: '3',
          date: moment()
            .subtract(1, 'd')
            .toDate(),
        },
      });

      const { adminNotes } = LoanService.get('loanId', { adminNotes: 1 });
      expect(adminNotes[0].note).to.equal('3');
    });

    it('caches the last proNote', () => {
      generator({ loans: { _id: 'loanId' }, users: { _id: 'userId' } });
      LoanService.setAdminNote({
        loanId: 'loanId',
        userId: 'userId',
        note: {
          note: '1',
          date: moment()
            .subtract(1, 'd')
            .toDate(),
          isSharedWithPros: true,
        },
      });
      LoanService.setAdminNote({
        loanId: 'loanId',
        userId: 'userId',
        note: {
          note: '2',
          date: moment().toDate(),
          isSharedWithPros: true,
        },
      });

      const { proNote } = LoanService.get('loanId', { proNote: 1 });
      expect(proNote.note).to.equal('2');
    });

    it('throws if you try to set a note in the future', () => {
      generator({ loans: { _id: 'loanId' }, users: { _id: 'userId' } });

      expect(() =>
        LoanService.setAdminNote({
          loanId: 'loanId',
          userId: 'userId',
          note: {
            note: '1',
            date: moment()
              .add(1, 'd')
              .toDate(),
            isSharedWithPros: true,
          },
        }),
      ).to.throw('futur');
    });

    it('sends an email to multiple pros if asked', async () => {
      generator({
        loans: {
          _id: 'loanId',
          name: '20-0001',
          user: {
            _id: 'userId',
            firstName: 'Joe',
            lastName: 'Jackson',
            referredByUser: {
              firstName: 'Pro',
              lastName: 'User',
              emails: [{ address: 'pro@e-potek.ch', verified: true }],
            },
          },
          assignees: {
            _id: 'adminId',
            _factory: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            $metadata: { isMain: true },
            emails: [{ address: 'admin@e-potek.ch', verified: true }],
          },
        },
      });

      await ddpWithUserId('adminId', () =>
        loanSetAdminNote.run({
          loanId: 'loanId',
          note: { note: 'hello dude', isSharedWithPros: true },
          notifyPros: [
            { email: 'test@e-potek.ch', withCta: true },
            { email: 'test2@e-potek.ch', withCta: true },
            { email: 'test3@e-potek.ch', withCta: true },
          ],
        }),
      );

      const [
        {
          address,
          template: {
            message: { subject, global_merge_vars, to, from_email, from_name },
          },
        },
      ] = await checkEmails(1);

      expect(address).to.equal('test@e-potek.ch');
      expect(subject).to.equal('Nouvelle note pour le dossier de Joe Jackson');
      expect(
        global_merge_vars.find(({ name }) => name === 'TITLE').content,
      ).to.equal('Nouvelle note pour le dossier 20-0001 de Joe Jackson');
      expect(
        global_merge_vars.find(({ name }) => name === 'BODY').content,
      ).to.include('Admin User');
      expect(
        global_merge_vars.find(({ name }) => name === 'BODY').content,
      ).to.include('hello dude');
      expect(
        global_merge_vars.find(({ name }) => name === 'CTA_URL').content,
      ).to.include(Meteor.settings.public.subdomains.pro);

      expect(to.length).to.equal(3);
      expect(to.every(({ type }) => type === 'bcc')).to.equal(true);
      expect(from_email).to.equal('admin@e-potek.ch');
      expect(from_name).to.equal('Admin User');
    });
  });

  describe('removeAdminNote', () => {
    it('removes an adminNote', () => {
      generator({ loans: { _id: 'loanId' }, users: { _id: 'userId' } });

      LoanService.setAdminNote({
        loanId: 'loanId',
        userId: 'userId',
        note: { note: 'hello' },
      });

      LoanService.setAdminNote({
        loanId: 'loanId',
        userId: 'userId',
        note: { note: 'world' },
      });

      const { adminNotes } = LoanService.get('loanId', { adminNotes: 1 });

      LoanService.removeAdminNote({
        docId: 'loanId',
        adminNoteId: adminNotes[1].id,
      });

      const { adminNotes: removed } = LoanService.get('loanId', {
        adminNotes: 1,
      });

      expect(removed.length).to.equal(1);
      expect(removed[0].note).to.equal('world');
    });

    it('removes the proNote if it is removed in adminNotes', () => {
      generator({ loans: { _id: 'loanId' }, users: { _id: 'userId' } });

      LoanService.setAdminNote({
        loanId: 'loanId',
        userId: 'userId',
        note: { note: 'hello' },
      });

      LoanService.setAdminNote({
        loanId: 'loanId',
        userId: 'userId',
        note: { note: 'world', isSharedWithPros: true },
      });

      const { adminNotes, proNote } = LoanService.get('loanId', {
        adminNotes: 1,
        proNote: 1,
      });
      expect(proNote.note).to.equal('world');

      LoanService.removeAdminNote({
        docId: 'loanId',
        adminNoteId: adminNotes[0].id,
      });

      const { proNote: removed } = LoanService.get('loanId', { proNote: 1 });

      expect(removed).to.equal(undefined);
    });
  });

  describe('insertBorrowers', () => {
    beforeEach(() => {
      generator({
        users: {
          _id: 'user',
          _factory: 'user',
          firstName: 'Bob',
          lastName: 'Dylan',
          phoneNumbers: ['12345'],
          emails: [{ address: 'bob.dylan@example.com', verified: true }],
        },
      });

      loanId = LoanService.fullLoanInsert({ userId: 'user' });
    });

    it('reuses user personal information on the first borrower', () => {
      LoanService.insertBorrowers({ loanId, amount: 1 });
      const { borrowers = [] } = LoanService.get(loanId, {
        borrowers: { firstName: 1, lastName: 1, email: 1, phoneNumber: 1 },
      });
      const [borrower] = borrowers;
      expect(borrower).to.deep.include({
        firstName: 'Bob',
        lastName: 'Dylan',
        email: 'bob.dylan@example.com',
        phoneNumber: '+41 12345',
      });
    });

    it('does not reuse user personal information when second borrower', () => {
      LoanService.insertBorrowers({ loanId, amount: 2 });
      const { borrowers = [] } = LoanService.get(loanId, {
        borrowers: { firstName: 1, lastName: 1, email: 1, phoneNumber: 1 },
      });
      const [borrower1, borrower2] = borrowers;
      expect(borrower1).to.deep.include({
        firstName: 'Bob',
        lastName: 'Dylan',
        email: 'bob.dylan@example.com',
        phoneNumber: '+41 12345',
      });
      expect(borrower2.firstName).to.equal(undefined);
      expect(borrower2.lastName).to.equal(undefined);
      expect(borrower2.phoneNumber).to.equal(undefined);
      expect(borrower2.email).to.equal(undefined);
    });
  });

  describe('generateDisbursedSoonLoansTasks', () => {
    const generateDisbursedLoans = (today, loansConfig) =>
      loansConfig.map(({ offset }, index) => ({
        _id: `l${index + 1}`,
        _factory: 'loan',
        name: `20-000${index + 1}`,
        user: {
          _id: `u${index + 1}`,
          _factory: 'user',
          assignedEmployeeId: 'admin',
        },
        disbursementDate: moment(today)
          .add(offset, 'days')
          .toDate(),
      }));

    afterEach(() => {
      SlackService.send.restore();
    });

    let today;
    let spy;

    beforeEach(async () => {
      today = new Date();
      generator({
        users: { _id: 'admin', _factory: 'admin' },
        loans: generateDisbursedLoans(today, [
          { offset: 0 },
          { offset: 5 },
          { offset: 9 },
          { offset: 10 },
          { offset: 11 },
          { offset: 10 },
        ]),
      });
      spy = sinon.spy();
      sinon.stub(SlackService, 'send').callsFake(spy);
      await generateDisbursedSoonLoansTasks.serverRun({});
    });

    it('generates the tasks for the loans disbursed in 10 days', async () => {
      const tasks = TaskService.fetch({ title: 1, assigneeLink: 1 });

      expect(tasks.length).to.equal(2);
      tasks.forEach(({ title, assigneeLink: { _id: adminId } }) => {
        expect(title).to.include(
          moment(today)
            .add(10, 'days')
            .format('DD.MM.YYYY'),
        );
        expect(adminId).to.equal('admin');
      });
    });
  });

  describe('selected lender organisation hook', () => {
    it('adds the link when an offer is selected in the selected structure', () => {
      generator({
        loans: {
          _id: 'loan',
          structures: [
            {
              id: 'struct',
            },
          ],
          selectedStructure: 'struct',
          lenders: [
            {
              organisation: { _id: 'org' },
              offers: [{ _id: 'offer' }],
            },
          ],
        },
      });

      const { selectedLenderOrganisation } = LoanService.get('loan', {
        selectedLenderOrganisation: { _id: 1 },
      });

      expect(selectedLenderOrganisation).to.equal(undefined);

      LoanService.update({
        loanId: 'loan',
        object: { structures: [{ id: 'struct', offerId: 'offer' }] },
      });

      const {
        selectedLenderOrganisation: selectedLenderOrganisationAfterUpdate,
      } = LoanService.get('loan', {
        selectedLenderOrganisation: { _id: 1 },
      });

      expect(selectedLenderOrganisationAfterUpdate).to.deep.include({
        _id: 'org',
      });
    });

    it('updates the link when the new selected structure has an offer from another lender selected', () => {
      generator({
        loans: {
          _id: 'loan',
          structures: [
            {
              id: 'struct',
              offerId: 'offer',
            },
            {
              id: 'struct2',
              offerId: 'offer2',
            },
          ],
          selectedStructure: 'struct',
          lenders: [
            {
              organisation: { _id: 'org' },
              offers: [{ _id: 'offer' }],
            },
            {
              organisation: { _id: 'org2' },
              offers: [{ _id: 'offer2' }],
            },
          ],
          selectedLenderOrganisation: { _id: 'org' },
        },
      });

      LoanService.update({
        loanId: 'loan',
        object: { selectedStructure: 'struct2' },
      });

      const { selectedLenderOrganisation } = LoanService.get('loan', {
        selectedLenderOrganisation: { _id: 1 },
      });

      expect(selectedLenderOrganisation).to.deep.include({ _id: 'org2' });
    });

    it('removes the link when the new selected structure has no selected offer and the previous had an offer selected', () => {
      generator({
        loans: {
          _id: 'loan',
          structures: [
            {
              id: 'struct',
              offerId: 'offer',
            },
            {
              id: 'struct2',
            },
          ],
          selectedStructure: 'struct',
          lenders: [
            {
              organisation: { _id: 'org' },
              offers: [{ _id: 'offer' }],
            },
          ],
          selectedLenderOrganisation: { _id: 'org' },
        },
      });

      LoanService.update({
        loanId: 'loan',
        object: { selectedStructure: 'struct2' },
      });

      const { selectedLenderOrganisation } = LoanService.get('loan', {
        selectedLenderOrganisation: { _id: 1 },
      });

      expect(selectedLenderOrganisation).to.equal(undefined);
    });

    it('removes the link when the new selected structure has no selected offer and the previous had no offer selected', () => {
      generator({
        loans: {
          _id: 'loan',
          structures: [
            {
              id: 'struct',
            },
            {
              id: 'struct2',
            },
          ],
          selectedStructure: 'struct',
        },
      });

      LoanService.update({
        loanId: 'loan',
        object: { selectedStructure: 'struct2' },
      });

      const { selectedLenderOrganisation } = LoanService.get('loan', {
        selectedLenderOrganisation: { _id: 1 },
      });

      expect(selectedLenderOrganisation).to.equal(undefined);
    });

    it('removes the link when the the selected offer is removed', () => {
      generator({
        loans: {
          _id: 'loan',
          structures: [
            {
              id: 'struct',
              offerId: 'offer',
            },
          ],
          selectedStructure: 'struct',
          lenders: [
            {
              organisation: { _id: 'org' },
              offers: [{ _id: 'offer' }],
            },
          ],
          selectedLenderOrganisation: { _id: 'org' },
        },
      });

      OfferService.remove({ offerId: 'offer' });

      const { selectedLenderOrganisation } = LoanService.get('loan', {
        selectedLenderOrganisation: { _id: 1 },
      });

      expect(selectedLenderOrganisation).to.equal(undefined);
    });
  });

  describe('setStatusToFinalizedIfRequired', () => {
    it('sets the status to FINALIZED if every revenue is CLOSED', () => {
      generator({
        loans: {
          _id: 'loan',
          revenues: [
            { status: REVENUE_STATUS.CLOSED },
            { status: REVENUE_STATUS.CLOSED },
          ],
        },
      });

      LoanService.setStatusToFinalizedIfRequired({ loanId: 'loan' });

      const { status } = LoanService.get('loan', { status: 1 });
      expect(status).to.equal(LOAN_STATUS.FINALIZED);
    });

    it('adds the activity', () => {
      generator({
        loans: {
          _id: 'loan',
          status: LOAN_STATUS.BILLING,
          revenues: [
            { status: REVENUE_STATUS.CLOSED },
            { status: REVENUE_STATUS.CLOSED },
          ],
        },
      });

      LoanService.setStatusToFinalizedIfRequired({ loanId: 'loan' });

      const { activities = [] } = LoanService.get('loan', {
        activities: { title: 1, description: 1 },
      });
      expect(activities.length).to.equal(2);
      expect(activities[1]).to.deep.include({
        title: 'Statut modifié',
        description:
          'Facturation -> Finalisé, automatiquement car tous les revenus ont été encaissés',
      });
    });

    it('does not set the status to FINALIZED if every revenue is not CLOSED', () => {
      generator({
        loans: {
          _id: 'loan',
          revenues: [
            { status: REVENUE_STATUS.EXPECTED },
            { status: REVENUE_STATUS.CLOSED },
          ],
        },
      });

      LoanService.setStatusToFinalizedIfRequired({ loanId: 'loan' });

      const { status } = LoanService.get('loan', { status: 1 });
      expect(status).to.equal(LOAN_STATUS.LEAD);
    });

    it('does not set the status to FINALIZED if there is an insurance revenue', () => {
      generator({
        loans: {
          _id: 'loan',
          revenues: [
            { status: REVENUE_STATUS.EXPECTED },
            { status: REVENUE_STATUS.CLOSED, type: REVENUE_TYPES.INSURANCE },
            { status: REVENUE_STATUS.CLOSED },
          ],
        },
      });

      LoanService.setStatusToFinalizedIfRequired({ loanId: 'loan' });

      const { status } = LoanService.get('loan', { status: 1 });
      expect(status).to.equal(LOAN_STATUS.LEAD);
    });

    it('does not add the activity if the status is already FINALIZED', () => {
      generator({
        loans: {
          _id: 'loan',
          status: LOAN_STATUS.FINALIZED,
          revenues: [
            { status: REVENUE_STATUS.EXPECTED },
            { status: REVENUE_STATUS.CLOSED },
          ],
        },
      });

      const { status, activities = [] } = LoanService.get('loan', {
        status: 1,
        activities: { _id: 1 },
      });
      expect(status).to.equal(LOAN_STATUS.FINALIZED);
      expect(activities.length).to.equal(1);
    });
  });
});
