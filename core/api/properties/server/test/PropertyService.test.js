/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import PropertyService from '../../PropertyService';
import { EXPERTISE_STATUS, PROPERTY_TYPE } from '../../propertyConstants';
import { WUEST_ERRORS } from '../../../wuest/wuestConstants';

describe('PropertyService', () => {
  beforeEach(() => {
    resetDatabase();
  });
  describe('evaluateProperty', () => {
    it('adds an error on the property', () => {
      const propertyId = Factory.create('property', {
        style: PROPERTY_TYPE.FLAT,
        address1: 'rue du four 2',
        zipCode: '1400',
        city: 'Yverdon-les-Bains',
        roomCount: 4,
        insideArea: 100,
        terraceArea: 20,
        constructionYear: 1,
      })._id;
      return PropertyService.evaluateProperty(propertyId).then(() => {
        const property = PropertyService.getPropertyById(propertyId);
        expect(property.valuation.status).to.equal(EXPERTISE_STATUS.ERROR);
        expect(property.valuation.error).contains('entre 1000 et 3000');
      });
    }).timeout(10000);

    it('throws if it cannot find the property', () => {
      expect(() => PropertyService.evaluateProperty('test')).to.throw(WUEST_ERRORS.NO_PROPERTY_FOUND);
    }).timeout(10000);

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
        expect(property.valuation.min).to.equal(610000);
        expect(property.valuation.max).to.equal(730000);
        expect(property.valuation.value).to.equal(668000);
      });
    });

    it('adds microlocation on the property', () => {
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
        expect(property.valuation).to.have.property('microlocation');
      });
    });
  }).timeout(10000);
});
