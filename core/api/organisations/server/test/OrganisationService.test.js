// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import generator from '../../../factories/factoriesHelpers';
import OrganisationService from '../OrganisationService';
import LenderRulesService from '../../../lenderRules/server/LenderRulesService';

describe.only('OrganisationService', function () {
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

      const [id1, id2] = LenderRulesService.initialize({
        organisationId: 'id1',
      });

      LenderRulesService.remove(id1);
      const rulez = LenderRulesService.findOne(id2);
      console.log('rulez:', rulez);

      const org = OrganisationService.findOne('id1');
      console.log('org:', org);

      expect(org.lenderRulesCount).to.equal(2);
    });
  });
});
