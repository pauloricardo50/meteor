/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { OWN_FUNDS_TYPES } from 'core/api/borrowers/borrowerConstants';
import Calculator from 'core/utils/Calculator';

import {
  checkArrayIsDone,
  dashboardTodosObject,
  defaultTodoList,
  getDashboardTodosArray,
} from '../dashboardTodos';

describe('dashboardTodos', () => {
  beforeEach(() => {
    sinon.stub(Calculator, 'personalInfoPercent').callsFake(() => 1);
    sinon.stub(Calculator, 'propertyPercent').callsFake(() => 1);
    sinon.stub(Calculator, 'filesProgress').callsFake(() => ({ percent: 1 }));
  });

  afterEach(() => {
    Calculator.personalInfoPercent.restore();
    Calculator.propertyPercent.restore();
    Calculator.filesProgress.restore();
  });

  describe('completeFirstStructure', () => {
    it('shows when no structure exists', () => {
      expect(
        dashboardTodosObject.completeFirstStructure.isDone({
          structures: [],
        }),
      ).to.equal(false);
    });

    it('is done when a complete structure exists', () => {
      expect(
        dashboardTodosObject.completeFirstStructure.isDone({
          structures: [
            {
              propertyValue: 1000000,
              wantedLoan: 800000,
              ownFunds: [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 250000 }],
            },
          ],
        }),
      ).to.equal(true);
      expect(
        dashboardTodosObject.completeFirstStructure.isDone({
          structures: [
            {},
            {
              propertyValue: 1000000,
              wantedLoan: 800000,
              ownFunds: [{ type: OWN_FUNDS_TYPES.BANK_FORTUNE, value: 250000 }],
            },
          ],
        }),
      ).to.equal(true);
    });
  });

  describe('completeProperty', () => {
    it('shows when property is missing things', () => {
      Calculator.propertyPercent.restore();
      sinon.stub(Calculator, 'propertyPercent').callsFake(() => 0.9);
      expect(
        dashboardTodosObject.completeProperty.isDone({
          structure: { property: {} },
          borrowers: [{}],
        }),
      ).to.equal(false);
    });

    it('is done when property is complete', () => {
      expect(
        dashboardTodosObject.completeProperty.isDone({
          structure: { property: { documents: {} } },
          borrowers: [{}],
        }),
      ).to.equal(true);
    });
  });

  describe('completeBorrowers', () => {
    it('shows when borrowers are missing things', () => {
      Calculator.personalInfoPercent.restore();
      sinon.stub(Calculator, 'personalInfoPercent').callsFake(() => 0.5);
      expect(
        dashboardTodosObject.completeBorrowers.isDone({
          borrowers: [{}],
        }),
      ).to.equal(false);
    });

    it('is done when property is complete', () => {
      expect(
        dashboardTodosObject.completeBorrowers.isDone({
          borrowers: [{}],
        }),
      ).to.equal(true);
    });
  });

  describe('uploadDocuments', () => {
    it('should be done when all files are uploaded', () => {
      expect(dashboardTodosObject.uploadDocuments.isDone({})).to.equal(true);
    });

    it('should not be done when not all files are uploaded', () => {
      Calculator.filesProgress.restore();
      sinon.stub(Calculator, 'filesProgress').callsFake(() => 0.5);
      expect(dashboardTodosObject.uploadDocuments.isDone({})).to.equal(false);
    });
  });

  describe('chooseOffer', () => {
    it('shows when no offer is chosen', () => {
      expect(
        dashboardTodosObject.chooseOffer.isDone({
          offers: [{}],
          structure: {},
        }),
      ).to.equal(false);
    });

    it('is done when an offer is chosen', () => {
      expect(
        dashboardTodosObject.chooseOffer.isDone({
          offers: [{}],
          structure: { offer: {} },
        }),
      ).to.equal(true);
    });
  });

  describe('createSecondStructure', () => {
    it('shows when the user only has a single structure', () => {
      expect(
        dashboardTodosObject.createSecondStructure.isDone({
          structures: [{}],
        }),
      ).to.equal(false);
    });
  });

  describe('callEpotek', () => {
    it('shows when all other todos are done', () => {
      const defaultTodos = getDashboardTodosArray(defaultTodoList);
      const callEpotek = defaultTodos.find(({ id }) => id === 'callEpotek');

      expect(
        callEpotek.hide({
          maxPropertyValue: { date: new Date() },
          structure: { property: {}, offer: {} },
          structures: [{}, {}],
          borrowers: [{ salary: 2000, bankFortune: [{ value: 3000 }] }],
          properties: [{}],
        }),
      ).to.equal(false);
    });

    it('hides if one thing is not done', () => {
      const defaultTodos = getDashboardTodosArray(defaultTodoList);
      const callEpotek = defaultTodos.find(({ id }) => id === 'callEpotek');

      Calculator.filesProgress.restore();
      sinon.stub(Calculator, 'filesProgress').callsFake(() => 0.8);
      expect(
        callEpotek.hide({
          structure: { property: {}, offer: {} },
          structures: [{}, {}],
          borrowers: [{}],
          offers: [{}],
          properties: [{}],
          documents: {},
        }),
      ).to.equal(true);
    });
  });

  describe('checkArrayIsDone', () => {
    it('returns false if one item is false', () => {
      expect(checkArrayIsDone([{ isDone: () => false }])).to.equal(false);
    });

    it('returns true if one item is hidden', () => {
      expect(checkArrayIsDone([{ hide: () => true }])).to.equal(true);
    });

    it('returns false if an item is not hidden and not done', () => {
      expect(
        checkArrayIsDone([{ hide: () => false, isDone: () => false }]),
      ).to.equal(false);
    });

    it('returns true if one item is true', () => {
      expect(checkArrayIsDone([{ isDone: () => true }])).to.equal(true);
    });

    it('returns true if one item is hidden', () => {
      expect(
        checkArrayIsDone([{ hide: () => true, isDone: () => true }]),
      ).to.equal(true);
    });

    it('returns true if an item is not hidden and not done', () => {
      expect(
        checkArrayIsDone([{ hide: () => false, isDone: () => true }]),
      ).to.equal(true);
    });

    it('combines all cases', () => {
      expect(
        checkArrayIsDone([
          { hide: () => false, isDone: () => true },
          { isDone: () => true },
          { hide: () => true },
        ]),
      ).to.equal(true);
    });

    it('filters out callEpotek', () => {
      expect(
        checkArrayIsDone([
          { hide: () => false, isDone: () => true },
          { isDone: () => true },
          { hide: () => true },
          { isDone: () => false, id: 'callEpotek' },
        ]),
      ).to.equal(true);
    });
  });
});
