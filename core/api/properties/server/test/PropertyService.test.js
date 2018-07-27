/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import PropertyService from '../../PropertyService';
import { EXPERTISE_STATUS } from '../../propertyConstants';
import { WUEST_ERRORS } from '../../../wuest/wuestConstants';

describe('PropertyService', () => {
  beforeEach(() => {
    resetDatabase();
  });
  describe('evaluateProperty', () => {
    it.skip('adds an error on the property', () => {
      const propertyId = Factory.create('property', {
        address1: 'rue du four 2',
        zipCode: '1400',
        city: 'Yverdon-les-Bains',
        roomCount: 4,
        insideArea: 100,
        terraceArea: 20,
      })._id;
      return PropertyService.evaluateProperty(propertyId).then(() => {
        const property = PropertyService.getPropertyById(propertyId);
        expect(property.valuation.status).to.equal(EXPERTISE_STATUS.ERROR);
        expect(property.valuation.error).to.equal('[Le champ Année de construction est obligatoire.]');
      });
    });

    it('throws if it cannot find the property', () => {
      expect(() => PropertyService.evaluateProperty('test')).to.throw(WUEST_ERRORS.NO_PROPERTY_FOUND);
    });

    it('adds min, max and value on the property', () => {
      const propertyId = Factory.create('property', {
        address1: 'rue du four 2',
        zipCode: '1400',
        city: 'Yverdon-les-Bains',
        roomCount: 4,
        constructionYear: 2000,
        insideArea: 100,
        terraceArea: 20,
      })._id;
      return PropertyService.evaluateProperty(propertyId).then(() => {
        const property = PropertyService.getPropertyById(propertyId);
        expect(property.valuation.min).to.equal(580000);
        expect(property.valuation.max).to.equal(690000);
        expect(property.valuation.value).to.equal(633000);
      });
    }).timeout(10000);
  });
});
