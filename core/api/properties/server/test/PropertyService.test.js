/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import {
  VALUATION_STATUS,
  PROPERTY_TYPE,
  RESIDENCE_TYPE,
  WUEST_ERRORS,
  QUALITY,
} from '../../../constants';
import WuestService from '../../../wuest/server/WuestService';
import PropertyService from '../PropertyService';
import generator from '../../../factories';
import { PROPERTY_CATEGORY } from '../../propertyConstants';
import UserService from '../../../users/server/UserService';
import { adminUser } from '../../../fragments';
import OrganisationService from '../../../organisations/server/OrganisationService';

describe('PropertyService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('evaluateProperty', () => {
    const getValueRange = value => ({
      min: value * 0.9,
      max: value * 1.1,
    });

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
        qualityProfileCondition: QUALITY.CONDITION.INTACT,
        qualityProfileStandard: QUALITY.STANDARD.AVERAGE,
      })._id;

      const loanResidenceType = RESIDENCE_TYPE.MAIN_RESIDENCE;

      return PropertyService.evaluateProperty({
        propertyId,
        loanResidenceType,
      }).then(() => {
        const property = PropertyService.get(propertyId);
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
        qualityProfileCondition: QUALITY.CONDITION.INTACT,
        qualityProfileStandard: QUALITY.STANDARD.AVERAGE,
      })._id;

      const loanResidenceType = RESIDENCE_TYPE.MAIN_RESIDENCE;

      return PropertyService.evaluateProperty({
        propertyId,
        loanResidenceType,
      }).then(() => {
        const property = PropertyService.get(propertyId);
        const marketValueBeforeCorrection = 709000;
        const statisticalPriceRangeMin = 640000;
        const statisticalPriceRangeMax = 770000;
        const priceRange = WuestService.getPriceRange({
          marketValueBeforeCorrection,
          statisticalPriceRangeMin,
          statisticalPriceRangeMax,
        });
        const valueRange = getValueRange(marketValueBeforeCorrection);
        const minRange = getValueRange(priceRange.min);
        const maxRange = getValueRange(priceRange.max);
        expect(property.valuation.value).to.be.within(
          valueRange.min,
          valueRange.max,
        );
        expect(property.valuation.min).to.be.within(minRange.min, minRange.max);
        expect(property.valuation.max).to.be.within(maxRange.min, maxRange.max);
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
        qualityProfileCondition: QUALITY.CONDITION.INTACT,
        qualityProfileStandard: QUALITY.STANDARD.AVERAGE,
      })._id;

      const loanResidenceType = RESIDENCE_TYPE.MAIN_RESIDENCE;

      return PropertyService.evaluateProperty({
        propertyId,
        loanResidenceType,
      }).then(() => {
        const property = PropertyService.get(propertyId);
        expect(property.valuation).to.have.property('microlocation');
      });
    }).timeout(10000);
  });

  describe('canton autovalue', () => {
    it('sets the canton on the property', () => {
      const propertyId = Factory.create('property', { zipCode: 1400 })._id;
      const property = PropertyService.get(propertyId);

      expect(property.canton).to.equal('VD');
    });

    it('removes the canton if an invalid zipcode is given', () => {
      const propertyId = Factory.create('property', { zipCode: 75000 })._id;
      const property = PropertyService.get(propertyId);

      expect(property.canton).to.equal(null);
    });
  });

  describe('inviteUser', () => {
    it('should invite and create a new user if it does not already exist', () => {
      generator({
        users: [
          { _factory: 'admin', _id: 'adminUser' },
          {
            _factory: 'pro',
            _id: 'proUser',
            assignedEmployeeId: 'adminUser',
            organisations: { _factory: 'organisation', _id: 'organisation' },
            properties: {
              _factory: 'property',
              _id: 'proProperty',
              category: PROPERTY_CATEGORY.PRO,
            },
          },
        ],
      });

      PropertyService.inviteUser({
        proUserId: 'proUser',
        user: {
          email: 'john@doe.com',
          firstName: 'John',
          name: 'Doe',
          phoneNumber: '123',
        },
        propertyId: 'proProperty',
      });

      const user = UserService.fetchOne({
        $filters: { 'emails.address': 'john@doe.com' },
        loans: { properties: { _id: 1 } },
        assignedEmployee: { _id: 1 },
        referredByUser: { _id: 1 },
        referredByOrganisation: { _id: 1 },
      });

      const {
        loans = [],
        assignedEmployee = {},
        referredByUser = {},
        referredByOrganisation = {},
      } = user;
      
      expect(loans.length).to.equal(1);
      expect(loans[0].properties.length).to.equal(1);
      expect(loans[0].properties[0]._id).to.equal('proProperty');
      expect(assignedEmployee._id).to.equal('adminUser');
      expect(referredByUser._id).to.equal('proUser');
      expect(referredByOrganisation._id).to.equal('organisation')
    });
  });
});
