// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import generator from '../../../factories/factoriesHelpers';
import OrganisationService from '../OrganisationService';
import LenderRulesService from '../../../lenderRules/server/LenderRulesService';

describe('OrganisationService', function () {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
  });

  describe('lenderRulesCount', () => {
    it('caches the lender rules count', () => {
      generator({
        organisations: {
          _id: 'id1',
          name: 'Org 1',
        },
      });

      const [id1] = LenderRulesService.initialize({
        organisationId: 'id1',
      });

      let org = OrganisationService.fetchOne({
        $filters: { _id: 'id1' },
        lenderRules: { _id: 1 },
        lenderRulesCount: 1,
      });

      expect(org.lenderRulesCount).to.equal(3);

      LenderRulesService.remove({ lenderRulesId: id1 });

      org = OrganisationService.fetchOne({
        $filters: { _id: 'id1' },
        lenderRules: { _id: 1 },
        lenderRulesCount: 1,
      });

      expect(org.lenderRulesCount).to.equal(2);
    });
  });
});
