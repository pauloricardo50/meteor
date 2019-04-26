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
import { checkEmails } from '../../../../utils/testHelpers';
import { EMAIL_IDS, EMAIL_TEMPLATES } from '../../../email/emailConstants';

describe('PropertyService', function () {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
  });

  describe.skip('evaluateProperty', () => {
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
            organisations: { _id: 'organisation' },
            properties: {
              _id: 'proProperty',
              category: PROPERTY_CATEGORY.PRO,
              address1: 'Rue du parc 3',
            },
          },
        ],
      });

      const { userId, admin, pro, isNewUser } = UserService.proCreateUser({
        user: {
          email: 'john@doe.com',
          firstName: 'John',
          name: 'Doe',
          phoneNumber: '123',
        },
        proUserId: 'proUser',
      });

      return PropertyService.inviteUser({
        propertyIds: ['proProperty'],
        admin,
        pro,
        userId,
        isNewUser,
      }).then(() => {
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
        expect(referredByOrganisation._id).to.equal('organisation');

        return checkEmails(1).then((emails) => {
          expect(emails.length).to.equal(1);
          const {
            emailId,
            address,
            response: { status },
            template: {
              template_name,
              message: { from_email, subject, merge_vars, from_name, to },
            },
          } = emails[0];
          expect(subject).to.equal('e-Potek - "Rue du parc 3"');
          expect(to.length).to.equal(3);
        });
      });
    });

    // FIXME: Fails because of meteor toys: https://github.com/MeteorToys/meteor-devtools/issues/111
    it.skip('should send an email invite if it is done by an admin', () => {
      generator({
        users: [
          { _factory: 'admin', _id: 'adminUser' },
          {
            _factory: 'pro',
            _id: 'proUser',
            assignedEmployeeId: 'adminUser',
            organisations: { _id: 'organisation' },
            properties: {
              _id: 'proProperty',
              category: PROPERTY_CATEGORY.PRO,
              address1: 'Rue du parc 5',
            },
          },
        ],
      });

      PropertyService.inviteUser({
        user: {
          email: 'john@doe.com',
          firstName: 'John',
          name: 'Doe',
          phoneNumber: '123',
        },
        propertyIds: ['proProperty'],
      });

      return checkEmails(1).then((emails) => {
        expect(emails.length).to.equal(2);
      });
    });

    it('should send an email invite if it is done by an admin and the user exists already', () => {
      generator({
        users: [
          {
            emails: [{ address: 'john@doe.com', verified: true }],
            assignedEmployee: {
              _factory: 'admin',
              _id: 'adminUser',
              firstName: 'Lydia',
              lastName: 'Abraha',
            },
          },
          {
            _factory: 'pro',
            _id: 'proUser',
            assignedEmployeeId: 'adminUser',
            organisations: { _id: 'organisation' },
            properties: {
              _id: 'proProperty',
              category: PROPERTY_CATEGORY.PRO,
              address1: 'Rue du parc 4',
            },
          },
        ],
      });

      const { userId, admin, isNewUser } = UserService.proCreateUser({
        user: {
          email: 'john@doe.com',
          firstName: 'John',
          name: 'Doe',
          phoneNumber: '123',
        },
      });

      PropertyService.inviteUser({
        propertyIds: ['proProperty'],
        userId,
        admin,
        isNewUser,
      });

      return checkEmails(1).then((emails) => {
        expect(emails.length).to.equal(1);
        const {
          emailId,
          address,
          response: { status },
          template: {
            template_name,
            message: { from_email, subject, merge_vars, from_name },
          },
        } = emails[0];
        expect(status).to.equal('sent');
        expect(emailId).to.equal(EMAIL_IDS.INVITE_USER_TO_PROPERTY);
        expect(template_name).to.equal(EMAIL_TEMPLATES.NOTIFICATION_AND_CTA.mandrillId);
        expect(address).to.equal('john@doe.com');
        expect(from_email).to.equal('info@e-potek.ch');
        expect(from_name).to.equal('e-Potek');
        expect(subject).to.equal('e-Potek - "Rue du parc 4"');
        expect(merge_vars[0].vars.find(({ name }) => name === 'BODY').content).to.include('Lydia Abraha');
      });
    });
  });

  describe('insertExternalProperty', () => {
    it('inserts a property with external properties', () => {
      generator({ users: { _factory: 'pro', _id: 'proId' } });

      PropertyService.insertExternalProperty({
        userId: 'proId',
        property: {
          externalId: 'abcd',
          imageUrls: ['https://www.e-potek.ch/img/logo_black.svg'],
          externalLink: 'www.e-potek.ch',
        },
      });

      const properties = PropertyService.fetch({
        externalId: 1,
      });

      expect(properties.length).to.equal(1);
      expect(properties[0].externalId).to.equal('abcd');
    });

    it('throws if a property with the same external id is inserted twice', () => {
      generator({
        properties: { externalId: 'abcd' },
        users: { _factory: 'pro', _id: 'proId' },
      });

      expect(() =>
        PropertyService.insertExternalProperty({
          userId: 'proId',
          property: {
            externalId: 'abcd',
            imageUrls: ['https://www.e-potek.ch/img/logo_black.svg'],
            externalLink: 'www.e-potek.ch',
          },
        })).to.throw('externalId');
    });
  });
});
