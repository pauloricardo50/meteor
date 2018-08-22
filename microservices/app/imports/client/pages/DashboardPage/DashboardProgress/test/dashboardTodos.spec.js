// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import sinon from 'sinon';
import PropertyCalculator from 'core/utils/Calculator/PropertyCalculator';
import BorrowerCalculator from 'core/utils/Calculator/BorrowerCalculator';
import { dashboardTodosObject } from '../dashboardTodos';
import { VALUATION_STATUS } from '../../../../../core/api/constants';

describe('dashboardTodos', () => {
  describe('createStructure', () => {
    it('shows when no structure exists', () => {
      expect(dashboardTodosObject.createStructure.condition({
        structures: [],
      })).to.equal(true);
    });

    it('hides when something is in structures array', () => {
      expect(dashboardTodosObject.createStructure.condition({
        structures: [undefined],
      })).to.equal(false);
      expect(dashboardTodosObject.createStructure.condition({
        structures: [{}],
      })).to.equal(false);
      expect(dashboardTodosObject.createStructure.condition({
        structures: ['hello world'],
      })).to.equal(false);
    });
  });

  describe('completeProperty', () => {
    it('shows when property is missing things', () => {
      expect(dashboardTodosObject.completeProperty.condition({
        general: {},
        structure: { property: {} },
        borrowers: [{}],
      })).to.equal(true);
    });

    it('hides when property is complete', () => {
      sinon
        .stub(PropertyCalculator, 'propertyPercent')
        .callsFake(() => 1);
      expect(dashboardTodosObject.completeProperty.condition({
        general: {},
        structure: { property: {documents:{}} },
        borrowers: [{}],
      })).to.equal(false);
      PropertyCalculator.propertyPercent.restore();
    });
  });

  describe('doAnExpertise', () => {
    it('shows when expertise status is NONE', () => {
      expect(dashboardTodosObject.doAnExpertise.condition({
        structure: {
          property: { valuation: { status: VALUATION_STATUS.NONE } },
        },
      })).to.equal(true);
    });

    it('hides when expertise is something else', () => {
      expect(dashboardTodosObject.doAnExpertise.condition({
        structure: {
          property: { valuation: { status: 'literally anything else' } },
        },
      })).to.equal(false);
    });
  });

  describe('completeBorrowers', () => {
    it('shows when borrowers are missing things', () => {
      expect(dashboardTodosObject.completeBorrowers.condition({
        borrowers: [{}],
      })).to.equal(true);
    });

    it('hides when property is complete', () => {
      sinon.stub(BorrowerCalculator, 'personalInfoPercent').callsFake(() => 1);
      expect(dashboardTodosObject.completeBorrowers.condition({
        borrowers: [{}],
      })).to.equal(false);
      BorrowerCalculator.personalInfoPercent.restore();
    });
  });

  describe('chooseOffer', () => {
    it('shows when no offer is chosen', () => {
      expect(dashboardTodosObject.chooseOffer.condition({
        offers: [{}],
        structure: {},
      })).to.equal(true);
    });

    it('hides when an offer is chosen', () => {
      expect(dashboardTodosObject.chooseOffer.condition({
        offers: [{}],
        structure: { offer: {} },
      })).to.equal(false);
    });
  });

  describe('createSecondStructure', () => {
    it('shows when the user only has a single structure', () => {
      expect(dashboardTodosObject.createSecondStructure.condition({
        structures: [{}],
      })).to.equal(true);
    });
  });

  describe('callEpotek', () => {
    it('shows when all other conditions are false', () => {
      sinon.stub(BorrowerCalculator, 'personalInfoPercent').callsFake(() => 1);
      sinon
        .stub(PropertyCalculator, 'getPropertyCompletion')
        .callsFake(() => 1);
      expect(dashboardTodosObject.callEpotek.condition({
        general: {},
        structure: { property: { valuation: {} }, offer: {} },
        structures: [{}, {}],
        borrowers: [{}],
        offers: [{}],
        properties: [{}],
      })).to.equal(true);
      BorrowerCalculator.personalInfoPercent.restore();
      PropertyCalculator.getPropertyCompletion.restore();
    });
  });
});
