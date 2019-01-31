// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import jsonLogic from 'json-logic-js';

import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import LenderRulesService from '../LenderRulesService';

describe.only('LenderRulesService', () => {
  let organisationId;
  let lenderRulesId;

  beforeEach(() => {
    resetDatabase();
    organisationId = Factory.create('organisation');
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
      } = LenderRulesService.fetchOne({
        $filters: { _id: rulesId },
        organisation: { name: 1 },
      });

      expect(name).to.not.equal(undefined);
    });
  });

  describe('update', () => {
    it('does not let you update the filter directly', () => {
      expect(() =>
        LenderRulesService.update({
          lenderRulesId: '',
          object: { filter: 'stuff' },
        })).to.throw('can not');
    });
  });

  describe('updateFilter', () => {
    it('updates the filter of a lenderRules document', () => {
      lenderRulesId = LenderRulesService.insert({ organisationId });
      LenderRulesService.updateFilter({
        lenderRulesId,
        logicRules: [{ '>': [{ var: 'a' }, 2] }],
      });

      const lenderRules = LenderRulesService.get(lenderRulesId);

      expect(jsonLogic.apply(lenderRules.filter, { a: 3 })).to.equal(true);
    });
  });
});
