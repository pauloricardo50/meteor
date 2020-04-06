import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';

import generator from '../../../factories/server';
import LoanService from '../../../loans/server/LoanService';
import UserService from '../../../users/server/UserService';
import { PROPERTY_CATEGORY } from '../../propertyConstants';
import PropertyService from '../PropertyService';

describe('PropertyService', function() {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
  });

  describe('insert', () => {
    it('adds a new property', () => {
      PropertyService.insert({
        property: {
          value: 100,
          address1: 'Chemin 1',
          city: 'Genève',
          zipCode: 1201,
        },
      });

      expect(PropertyService.find().fetch()[0]).to.deep.include({
        value: 100,
      });
    });
  });

  describe('remove', () => {
    it('removes a property', () => {
      generator({ properties: { _id: 'prop', loans: {} } });

      expect(PropertyService.remove({ propertyId: 'prop' })).to.equal(1);

      expect(PropertyService.find({}).fetch().length).to.equal(0);
    });

    it('does not remove a property if it has multiple loans, without specifiying from which to remove it', () => {
      generator({ properties: { _id: 'prop', loans: [{}, {}] } });

      expect(PropertyService.remove({ propertyId: 'prop' })).to.equal(false);

      expect(PropertyService.find({}).fetch().length).to.equal(1);
    });

    it('unlinks a property if it has multiple loans', () => {
      generator({
        properties: {
          _id: 'prop',
          loans: [
            { _id: 'loan', structures: [{ id: 'a', propertyId: 'prop' }] },
            { _id: 'loan2' },
          ],
        },
      });

      expect(
        PropertyService.remove({ propertyId: 'prop', loanId: 'loan' }),
      ).to.equal(1);

      expect(PropertyService.find({}).fetch().length).to.equal(1);
      expect(
        LoanService.get('loan', { propertyIds: 1 }).propertyIds,
      ).to.deep.equal([]);
      expect(
        LoanService.get('loan', { structures: 1 }).structures[0].propertyId,
      ).to.equal(null);
      expect(
        LoanService.get('loan2', { propertyIds: 1 }).propertyIds,
      ).to.deep.equal(['prop']);
    });
  });

  describe('canton autovalue', () => {
    it('sets the canton on the property', () => {
      const propertyId = Factory.create('property', { zipCode: 1400 })._id;
      const property = PropertyService.get(propertyId, { canton: 1 });

      expect(property.canton).to.equal('VD');
    });

    it('removes the canton if an invalid zipcode is given', () => {
      const propertyId = Factory.create('property', { zipCode: 75000 })._id;
      const property = PropertyService.get(propertyId, { canton: 1 });

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
            organisations: { _id: 'organisation', $metadata: { isMain: true } },
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

      PropertyService.inviteUser({
        propertyIds: ['proProperty'],
        admin,
        pro,
        userId,
        isNewUser,
      });

      const user = UserService.getByEmail('john@doe.com', {
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
        }),
      ).to.throw('externalId');
    });
  });

  describe('reducers', () => {
    it('organisation', () => {
      generator({
        properties: {
          _id: 'propertyId',
          users: {
            _id: 'proId',
            firstName: 'Joe',
            lastName: 'Jackson',
            organisations: {
              _id: 'org',
              name: 'Org1',
              address1: 'Rue du parc 7',
            },
          },
          loans: { _id: 'loan', name: '18-0101' },
        },
      });

      const prop = PropertyService.get('propertyId', { organisation: 1 });

      expect(prop.organisation).to.deep.equal({
        _id: 'org',
        _collection: 'organisations',
        name: 'Org1',
        userLinks: [{ _id: 'proId', shareCustomers: true }],
      });
    });
  });
});
