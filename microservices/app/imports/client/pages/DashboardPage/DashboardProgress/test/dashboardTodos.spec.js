// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import sinon from 'sinon';
import Calculator from 'core/utils/Calculator';
import PropertyCalculator from 'core/utils/Calculator/PropertyCalculator';
import BorrowerCalculator from 'core/utils/Calculator/BorrowerCalculator';
import { dashboardTodosObject } from '../dashboardTodos';
import { VALUATION_STATUS } from '../../../../../core/api/constants';

describe('dashboardTodos', () => {
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
      expect(dashboardTodosObject.completeProperty.isDone({
        general: {},
        structure: { property: {} },
        borrowers: [{}],
      })).to.equal(false);
    });

    it('hides when property is complete', () => {
      sinon.stub(PropertyCalculator, 'propertyPercent').callsFake(() => 1);
      expect(dashboardTodosObject.completeProperty.isDone({
        general: {},
        structure: { property: { documents: {} } },
        borrowers: [{}],
      })).to.equal(true);
      PropertyCalculator.propertyPercent.restore();
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
      expect(dashboardTodosObject.completeBorrowers.isDone({
        borrowers: [{}],
      })).to.equal(false);
    });

    it('hides when property is complete', () => {
      sinon.stub(BorrowerCalculator, 'personalInfoPercent').callsFake(() => 1);
      expect(dashboardTodosObject.completeBorrowers.isDone({
        borrowers: [{}],
      })).to.equal(true);
      BorrowerCalculator.personalInfoPercent.restore();
    });
  });

  describe('uploadDocuments', () => {
    it('hides when documents are not there yet', () => {
      expect(dashboardTodosObject.uploadDocuments.hide({})).to.equal(true);
      expect(dashboardTodosObject.uploadDocuments.hide({
        documents: undefined,
      })).to.equal(true);
    });

    it('does not hide when documents is an ampty object', () => {
      expect(dashboardTodosObject.uploadDocuments.hide({
        documents: {},
      })).to.equal(false);
    });

    it('should be done when all files are uploaded', () => {
      sinon.stub(Calculator, 'filesProgress').callsFake(() => 1);
      expect(dashboardTodosObject.uploadDocuments.isDone({})).to.equal(true);
      Calculator.filesProgress.restore();
    });

    it('should not be done when not all files are uploaded', () => {
      sinon.stub(Calculator, 'filesProgress').callsFake(() => 0.8);
      expect(dashboardTodosObject.uploadDocuments.isDone({})).to.equal(false);
      Calculator.filesProgress.restore();
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
    it('shows when all other conditions are false', () => {
      sinon.stub(BorrowerCalculator, 'personalInfoPercent').callsFake(() => 1);
      sinon
        .stub(PropertyCalculator, 'getPropertyCompletion')
        .callsFake(() => 1);
      expect(dashboardTodosObject.callEpotek.isDone({
        general: {},
        structure: { property: { valuation: {} }, offer: {} },
        structures: [{}, {}],
        borrowers: [{}],
        offers: [{}],
        properties: [{}],
      })).to.equal(false);
      BorrowerCalculator.personalInfoPercent.restore();
      PropertyCalculator.getPropertyCompletion.restore();
    });
  });
});
