// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import jsonLogic from 'json-logic-js';

import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import generator from 'core/api/factories';
import LenderRulesService from '../LenderRulesService';
import { EXPENSE_TYPES } from '../../lenderRulesConstants';

describe('LenderRulesService', () => {
  let organisationId;
  let lenderRulesId;

  beforeEach(() => {
    resetDatabase();
    organisationId = Factory.create('organisation')._id;
    // Insert a document here, to avoid cases where all documents in a collection are changed
    Factory.create('lenderRules');
  });

  describe('initialize', () => {
    it('adds 3 lenderRules', () => {
      const ids = LenderRulesService.initialize({ organisationId });

      const lenderRules = LenderRulesService.fetch({
        $filters: { _id: { $in: ids } },
        filters: 1,
      });

      expect(lenderRules.length).to.equal(3);
    });
  });

  describe('insert', () => {
    it('adds a link to the organisation', () => {
      const rulesId = LenderRulesService.insert({ organisationId });

      const {
        organisation: { name },
      } = LenderRulesService.get(rulesId, { organisation: { name: 1 } });

      expect(name).to.not.equal(undefined);
    });

    it('sets the order of the lenderRules', () => {
      const rulesId1 = LenderRulesService.insert({ organisationId });
      const rulesId2 = LenderRulesService.insert({ organisationId });

      const { order: order1 } = LenderRulesService.get(rulesId1, { order: 1 });
      const { order: order2 } = LenderRulesService.get(rulesId2, { order: 1 });

      expect(order1).to.equal(0);
      expect(order2).to.equal(1);
    });
  });

  describe('update', () => {
    it('does not let you update the filter directly', () => {
      expect(() =>
        LenderRulesService.update({
          lenderRulesId: '',
          object: { filter: 'stuff' },
        }),
      ).to.throw('can not');
    });

    it('unsets expensesSubtractFromIncome if it is set to an empty array', () => {
      generator({
        lenderRules: {
          _id: 'rulesId',
          expensesSubtractFromIncome: [EXPENSE_TYPES.LEASING],
        },
      });
      LenderRulesService.update({
        lenderRulesId: 'rulesId',
        object: { expensesSubtractFromIncome: [] },
      });

      expect(
        LenderRulesService.get('rulesId', { expensesSubtractFromIncome: 1 })
          .expensesSubtractFromIncome,
      ).to.equal(undefined);
    });
  });

  describe('updateFilter', () => {
    it('updates the filter of a lenderRules document', () => {
      lenderRulesId = LenderRulesService.insert({ organisationId });
      LenderRulesService.updateFilter({
        lenderRulesId,
        logicRules: [{ '>': [{ var: 'a' }, 2] }],
      });

      const lenderRules = LenderRulesService.get(lenderRulesId, { filter: 1 });

      expect(jsonLogic.apply(lenderRules.filter, { a: 3 })).to.equal(true);
    });
  });

  describe('setOrder', () => {
    it('changes the order of all rules', () => {
      const id1 = Factory.create('lenderRules', {
        'organisationLink._id': organisationId,
      })._id;
      const id2 = Factory.create('lenderRules', {
        'organisationLink._id': organisationId,
      })._id;

      LenderRulesService.setOrder({ orders: { [id1]: 1, [id2]: 0 } });

      expect(LenderRulesService.get(id1, { order: 1 }).order).to.equal(1);
      expect(LenderRulesService.get(id2, { order: 1 }).order).to.equal(0);
    });

    it('throws if you try to set an invalid order', () => {
      const id1 = Factory.create('lenderRules', {
        'organisationLink._id': organisationId,
      })._id;
      const id2 = Factory.create('lenderRules', {
        'organisationLink._id': organisationId,
      })._id;

      expect(() =>
        LenderRulesService.setOrder({ orders: { [id1]: 2, [id2]: 3 } }),
      ).to.throw('ordre des filtres');
    });

    it("throws if lenderRules don't belong to the same org", () => {
      const organisationId2 = Factory.create('organisation', { name: 'org2' })
        ._id;

      const id1 = Factory.create('lenderRules', {
        'organisationLink._id': organisationId,
      })._id;
      const id2 = Factory.create('lenderRules', {
        'organisationLink._id': organisationId2,
      })._id;

      expect(() =>
        LenderRulesService.setOrder({ orders: { [id1]: 2, [id2]: 3 } }),
      ).to.throw('même organisation');
    });
  });
});
