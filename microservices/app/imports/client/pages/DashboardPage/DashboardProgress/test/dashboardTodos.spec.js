// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import sinon from 'sinon';
import Calculator from 'core/utils/Calculator';
import PropertyCalculator from 'core/utils/Calculator/PropertyCalculator';
import BorrowerCalculator from 'core/utils/Calculator/BorrowerCalculator';
import {
  dashboardTodosObject,
  checkArrayIsDone,
  getDashboardTodosArray,
  defaultTodoList,
} from '../dashboardTodos';
import { VALUATION_STATUS } from '../../../../../core/api/constants';

describe('dashboardTodos', () => {
  beforeEach(() => {
    sinon.stub(BorrowerCalculator, 'personalInfoPercent').callsFake(() => 1);
    sinon.stub(PropertyCalculator, 'propertyPercent').callsFake(() => 1);
    sinon.stub(Calculator, 'filesProgress').callsFake(() => ({ percent: 1 }));
  });

  afterEach(() => {
    BorrowerCalculator.personalInfoPercent.restore();
    PropertyCalculator.propertyPercent.restore();
    Calculator.filesProgress.restore();
  });

  describe('createStructure', () => {
    it('shows when no structure exists', () => {
      expect(dashboardTodosObject.createStructure.isDone({
        structures: [],
      })).to.equal(false);
    });

    it('hides when something is in structures array', () => {
      expect(dashboardTodosObject.createStructure.isDone({
        structures: [undefined],
      })).to.equal(true);
      expect(dashboardTodosObject.createStructure.isDone({
        structures: [{}],
      })).to.equal(true);
      expect(dashboardTodosObject.createStructure.isDone({
        structures: ['hello world'],
      })).to.equal(true);
    });
  });

  describe('completeProperty', () => {
    it('shows when property is missing things', () => {
      PropertyCalculator.propertyPercent.restore();
      sinon.stub(PropertyCalculator, 'propertyPercent').callsFake(() => 0.9);
      expect(dashboardTodosObject.completeProperty.isDone({
        general: {},
        structure: { property: {} },
        borrowers: [{}],
      })).to.equal(false);
    });

    it('hides when property is complete', () => {
      expect(dashboardTodosObject.completeProperty.isDone({
        general: {},
        structure: { property: { documents: {} } },
        borrowers: [{}],
      })).to.equal(true);
    });
  });

  describe('doAnExpertise', () => {
    it('shows when expertise status is NONE', () => {
      expect(dashboardTodosObject.doAnExpertise.isDone({
        structure: {
          property: { valuation: { status: VALUATION_STATUS.NONE } },
        },
      })).to.equal(false);
    });

    it('hides when expertise is something else', () => {
      expect(dashboardTodosObject.doAnExpertise.isDone({
        structure: {
          property: { valuation: { status: 'literally anything else' } },
        },
      })).to.equal(true);
    });
  });

  describe('completeBorrowers', () => {
    it('shows when borrowers are missing things', () => {
      BorrowerCalculator.personalInfoPercent.restore();
      sinon
        .stub(BorrowerCalculator, 'personalInfoPercent')
        .callsFake(() => 0.5);
      expect(dashboardTodosObject.completeBorrowers.isDone({
        borrowers: [{}],
      })).to.equal(false);
    });

    it('hides when property is complete', () => {
      expect(dashboardTodosObject.completeBorrowers.isDone({
        borrowers: [{}],
      })).to.equal(true);
    });
  });

  describe('uploadDocuments', () => {
    it('hides when documents are not there yet', () => {
      expect(dashboardTodosObject.uploadDocuments.hide({})).to.equal(true);
      expect(dashboardTodosObject.uploadDocuments.hide({
        documents: undefined,
      })).to.equal(true);
    });

    it('does not hide when documents is an empty object', () => {
      expect(dashboardTodosObject.uploadDocuments.hide({
        documents: {},
      })).to.equal(false);
    });

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
      expect(dashboardTodosObject.chooseOffer.isDone({
        offers: [{}],
        structure: {},
      })).to.equal(false);
    });

    it('hides when an offer is chosen', () => {
      expect(dashboardTodosObject.chooseOffer.isDone({
        offers: [{}],
        structure: { offer: {} },
      })).to.equal(true);
    });
  });

  describe('createSecondStructure', () => {
    it('shows when the user only has a single structure', () => {
      expect(dashboardTodosObject.createSecondStructure.isDone({
        structures: [{}],
      })).to.equal(false);
    });
  });

  describe('callEpotek', () => {
    it('shows when all other todos are done', () => {
      const defaultTodos = getDashboardTodosArray(defaultTodoList);
      const callEpotek = defaultTodos.find(({ id }) => id === 'callEpotek');

      expect(callEpotek.hide({
        general: {},
        structure: { property: { valuation: {} }, offer: {} },
        structures: [{}, {}],
        borrowers: [{ salary: 2000, bankFortune: 3000 }],
        properties: [{}],
      })).to.equal(false);
    });

    it('hides if one thing is not done', () => {
      const defaultTodos = getDashboardTodosArray(defaultTodoList);
      const callEpotek = defaultTodos.find(({ id }) => id === 'callEpotek');

      Calculator.filesProgress.restore();
      sinon.stub(Calculator, 'filesProgress').callsFake(() => 0.8);
      expect(callEpotek.hide({
        general: {},
        structure: { property: { valuation: {} }, offer: {} },
        structures: [{}, {}],
        borrowers: [{}],
        offers: [{}],
        properties: [{}],
        documents: {},
      })).to.equal(true);
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
      expect(checkArrayIsDone([{ hide: () => false, isDone: () => false }])).to.equal(false);
    });

    it('returns true if one item is true', () => {
      expect(checkArrayIsDone([{ isDone: () => true }])).to.equal(true);
    });

    it('returns true if one item is hidden', () => {
      expect(checkArrayIsDone([{ hide: () => true, isDone: () => true }])).to.equal(true);
    });

    it('returns true if an item is not hidden and not done', () => {
      expect(checkArrayIsDone([{ hide: () => false, isDone: () => true }])).to.equal(true);
    });

    it('combines all cases', () => {
      expect(checkArrayIsDone([
        { hide: () => false, isDone: () => true },
        { isDone: () => true },
        { hide: () => true },
      ])).to.equal(true);
    });

    it('filters out callEpotek', () => {
      expect(checkArrayIsDone([
        { hide: () => false, isDone: () => true },
        { isDone: () => true },
        { hide: () => true },
        { isDone: () => false, id: 'callEpotek' },
      ])).to.equal(true);
    });
  });
});
