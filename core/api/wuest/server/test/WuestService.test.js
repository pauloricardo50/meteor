/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import WuestService from '../WuestService';
import { ERRORS } from '../../wuestConstants';

describe.only('WuestService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('evaluateById', () => {
    it('throws if it can not find the property', () => {
      expect(() => WuestService.evaluateById('test')).to.throw(ERRORS.NO_PROPERTY_FOUND);
    });

    it('returns min and max', () => {
      const propertyId = Factory.create('property', {
        address1: 'rue du four 2',
        zipCode: '1400',
        city: 'Yverdon-les-Bains',
        roomCount: 4,
        constructionYear: 2000,
        insideArea: 100,
        terraceArea: 20,
      })._id;
      return WuestService.evaluateById(propertyId).then((result) => {
        expect(result).to.deep.equal({
          min: 580000,
          max: 690000,
          value: 633000,
        });
      });
    }).timeout(10000);
  });
});
