/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import PropertyService from '../../PropertyService';
import {
  VALUATION_STATUS,
  PROPERTY_TYPE,
  RESIDENCE_TYPE,
  WUEST_ERRORS,
} from '../../../constants';

describe('PropertyService', () => {
  beforeEach(() => {
    resetDatabase();
  });
  describe('evaluateProperty', () => {
    it('adds an error on the property', () => {
      const propertyId = Factory.create('property', {
        propertyType: PROPERTY_TYPE.FLAT,
        address1: 'rue du four 2',
        zipCode: '1400',
        city: 'Yverdon-les-Bains',
        roomCount: 4,
        insideArea: 100,
        terraceArea: 20,
        constructionYear: 1,
        numberOfFloors: 10,
        floorNumber: 3,
      })._id;

      const loanResidenceType = RESIDENCE_TYPE.MAIN_RESIDENCE;

      return PropertyService.evaluateProperty({
        propertyId,
        loanResidenceType,
      }).then(() => {
        const property = PropertyService.getPropertyById(propertyId);
        expect(property.valuation.status).to.equal(VALUATION_STATUS.ERROR);
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
        numberOfFloors: 10,
        floorNumber: 3,
      })._id;

      const loanResidenceType = RESIDENCE_TYPE.MAIN_RESIDENCE;

      return PropertyService.evaluateProperty({
        propertyId,
        loanResidenceType,
      }).then(() => {
        const property = PropertyService.getPropertyById(propertyId);
        expect(property.valuation.min).to.equal(640000);
        expect(property.valuation.max).to.equal(770000);
        expect(property.valuation.value).to.equal(705000);
      });
    }).timeout(10000);

    it('adds microlocation on the property', () => {
      const propertyId = Factory.create('property', {
        address1: 'rue du four 2',
        zipCode: '1400',
        city: 'Yverdon-les-Bains',
        roomCount: 4,
        constructionYear: 2000,
        insideArea: 100,
        terraceArea: 20,
        numberOfFloors: 10,
        floorNumber: 3,
      })._id;

      const loanResidenceType = RESIDENCE_TYPE.MAIN_RESIDENCE;

      return PropertyService.evaluateProperty({
        propertyId,
        loanResidenceType,
      }).then(() => {
        const property = PropertyService.getPropertyById(propertyId);
        expect(property.valuation).to.have.property('microlocation');
      });
    }).timeout(10000);
  });
});
