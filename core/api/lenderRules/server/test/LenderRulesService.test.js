// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import LenderRulesService from '../LenderRulesService';

describe('LenderRulesService', () => {
  let organisationId;
  let lenderRulesId;

  beforeEach(() => {
    resetDatabase();
    organisationId = Factory.create('organisation');
    // Insert a document here, to avoid cases where all documents in a collection are changed
    Factory.create('lenderRules');
  });

  describe('insert', () => {
    it('adds 2 filters with random ids', () => {
      lenderRulesId = LenderRulesService.insert({ organisationId });

      const { filters } = LenderRulesService.fetchOne({
        $filters: { _id: lenderRulesId },
        filters: 1,
      });

      expect(filters.length).to.equal(2);

      const [filter1, filter2] = filters;
      expect(filter1.id).to.not.equal(filter2.id);
    });

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

  describe('removeFilter', () => {
    it('removes a matching filter', () => {
      lenderRulesId = LenderRulesService.insert({ organisationId });
      let { filters } = LenderRulesService.fetchOne({
        $filters: { _id: lenderRulesId },
        filters: 1,
      });
      const [filter1, filter2] = filters;

      LenderRulesService.removeFilter({ lenderRulesId, filterId: filter2.id });

      filters = LenderRulesService.fetchOne({
        $filters: { _id: lenderRulesId },
        filters: 1,
      }).filters;

      expect(filters.length).to.equal(1);
      expect(filters[0].id).to.equal(filter1.id);
    });

    it('does nothing if the id does not exist', () => {
      lenderRulesId = LenderRulesService.insert({ organisationId });

      LenderRulesService.removeFilter({ lenderRulesId, filterId: 'someId' });

      const { filters } = LenderRulesService.fetchOne({
        $filters: { _id: lenderRulesId },
        filters: 1,
      });

      expect(filters.length).to.equal(2);
    });
  });

  describe('updateFilter', () => {
    it('updates the right filter', () => {
      lenderRulesId = LenderRulesService.insert({ organisationId });
      let filters;
      filters = LenderRulesService.fetchOne({
        $filters: { _id: lenderRulesId },
        filters: 1,
      }).filters;
      const [filter1, filter2] = filters;

      LenderRulesService.updateFilter({
        lenderRulesId,
        filterId: filter2.id,
        rules: { maxBorrowRatio: 0.6 },
      });

      filters = LenderRulesService.fetchOne({
        $filters: { _id: lenderRulesId },
        filters: 1,
      }).filters;

      expect(filters[0]).to.deep.equal(filter1);
      expect(filters[1].maxBorrowRatio).to.equal(0.6);
    });

    it('throws if no filter id matches', () => {
      lenderRulesId = LenderRulesService.insert({ organisationId });
      let filters;
      filters = LenderRulesService.fetchOne({
        $filters: { _id: lenderRulesId },
        filters: 1,
      }).filters;
      const [filter1, filter2] = filters;

      expect(() =>
        LenderRulesService.updateFilter({
          lenderRulesId,
          filterId: 'heya',
        })).to.throw('pas');
    });

    it('throws if you try to update the filter rule directly', () => {
      lenderRulesId = LenderRulesService.insert({ organisationId });

      expect(() =>
        LenderRulesService.updateFilter({
          lenderRulesId,
          rules: { filter: { yo: 'dude' } },
        })).to.throw('can not');
    });
  });
});
