/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from '/imports/js/helpers/testHelpers';
import sinon from 'sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import Properties from '../properties';

import {
  insertProperty,
  deleteProperty,
  updateProperty,
  setPropertyField,
} from '../methods';

describe('Properties', () => {
  describe('methods', () => {
    describe('insertComparator', () => {
      let userId;

      beforeEach(() => {
        resetDatabase();
        stubCollections();
        userId = Factory.create('user')._id;
        sinon.stub(Meteor, 'userId').callsFake(() => userId);
      });

      afterEach(() => {
        stubCollections.restore();
        Meteor.userId.restore();
      });

      it('works', () => {
        const object = {
          value: 100,
          address: '10 Downing Street, city',
          latitude: 1,
          longitude: 2,
        };

        const propertyId = insertProperty.call({ object });
        const property = Properties.findOne(propertyId);

        expect(property.userId).to.equal(userId);
        expect(property.name).to.equal('10 Downing Street');
        expect(property.value).to.equal(object.value);
        expect(property.address).to.equal(object.address);
        expect(property.latitude).to.equal(object.latitude);
        expect(property.longitude).to.equal(object.longitude);
        // console.log(JSON.stringify(property, 0, 2));
      });
    });

    describe('modifiers', () => {
      let userId;
      let propertyId;

      beforeEach(() => {
        resetDatabase();
        stubCollections();
        userId = Factory.create('user')._id;
        propertyId = Factory.create('property', { userId })._id;
        sinon.stub(Meteor, 'userId').callsFake(() => userId);
      });

      afterEach(() => {
        stubCollections.restore();
        Meteor.userId.restore();
      });

      describe('deleteProperty', () => {
        it('works', () => {
          deleteProperty.call({ id: propertyId });

          const property = Properties.findOne(propertyId);

          expect(property).to.equal(undefined);
        });
      });

      describe('updateProperty', () => {
        it('works', () => {
          let property = Properties.findOne(propertyId);
          expect(property.name).to.equal('testName');

          updateProperty.call({ id: propertyId, object: { name: 'newName' } });

          property = Properties.findOne(propertyId);
          expect(property.name).to.equal('newName');
        });
      });

      describe('setPropertyField', () => {
        it('works', () => {});
      });
    });
  });
});
