/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from '/imports/js/helpers/testHelpers';
import sinon from 'sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import Comparators from '../comparators';

import {
  insertComparator,
  updateComparator,
  addComparatorField,
  removeComparatorField,
  toggleHiddenField,
} from '../methods';

describe('Comparators', () => {
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

      it('works and sets defaultValues', () => {
        const id = insertComparator.call();
        const comparator = Comparators.findOne(id);

        expect(typeof comparator).to.equal('object');

        // FIXME
        // expect(comparator.useBorrowers).to.equal(false);
        // expect(comparator.usageType).to.equal('primary');
        // expect(comparator.customFields).to.equal([]);
        // expect(comparator.customFieldCount).to.equal(0);
        // expect(comparator.hiddenFields).to.equal([
        //   'realBorrowRatio',
        //   'incomeRatio',
        //   'theoreticalMonthly',
        // ]);
      });

      it('throws an error if you try to insert more than 1', () => {
        insertComparator._execute({}, {});
        expect(() => insertComparator._execute({}, {})).to.throw(
          Meteor.Error,
          "Can't have more than one comparator per user",
        );
      });
    });

    describe('modifiers', () => {
      let userId;
      let comparatorId;

      beforeEach(() => {
        resetDatabase();
        stubCollections();
        userId = Factory.create('user')._id;
        comparatorId = Factory.create('comparator', { userId })._id;
        sinon.stub(Meteor, 'userId').callsFake(() => userId);
      });

      afterEach(() => {
        stubCollections.restore();
        Meteor.userId.restore();
      });

      describe('updateComparator', () => {
        it('works', () => {
          let comparator = Comparators.findOne(comparatorId);
          expect(typeof comparator).to.equal('object');
          expect(comparator.useBorrowers).to.equal(undefined);

          updateComparator._execute(
            {},
            { object: { useBorrowers: true }, id: comparatorId },
          );

          comparator = Comparators.findOne(comparatorId);
          expect(comparator.useBorrowers).to.equal(true);
        });
      });

      describe('addComparatorField', () => {
        it('works', () => {
          let comparator = Comparators.findOne(comparatorId);
          expect(comparator.customFieldCount).to.equal(0);
          expect(comparator.customFields.length).to.equal(0);

          const object = { name: 'testField', type: 'testType' };
          addComparatorField._execute(
            {},
            {
              object,
              id: comparatorId,
            },
          );

          comparator = Comparators.findOne(comparatorId);
          expect(comparator.customFieldCount).to.equal(1);
          expect(comparator.customFields.length).to.equal(1);
          expect(comparator.customFields[0].id).to.equal('custom0');
          expect(comparator.customFields[0].name).to.equal(object.name);
          expect(comparator.customFields[0].type).to.equal(object.type);
        });
      });

      describe('removeComparatorField', () => {
        it('works', () => {
          comparatorId = Factory.create('comparator', {
            userId,
            customFieldCount: 1,
            customFields: [{ id: 'test', name: 'testName', type: 'testType' }],
          })._id;

          removeComparatorField.call({
            object: { fieldId: 'test' },
            id: comparatorId,
          });
          const comparator = Comparators.findOne(comparatorId);

          expect(comparator.customFields.length).to.equal(0);
          expect(comparator.customFieldCount).to.equal(1);
        });

        it('removes the correct field when multiple exist', () => {
          comparatorId = Factory.create('comparator', {
            userId,
            customFieldCount: 3,
            customFields: [
              { id: 'test1', name: 'testName', type: 'testType' },
              { id: 'test2', name: 'testName', type: 'testType' },
              { id: 'test3', name: 'testName', type: 'testType' },
            ],
          })._id;

          removeComparatorField.call({
            object: { fieldId: 'test2' },
            id: comparatorId,
          });
          const comparator = Comparators.findOne(comparatorId);

          expect(comparator.customFields.length).to.equal(2);
          expect(comparator.customFieldCount).to.equal(3);
          expect(comparator.customFields[0].id).to.equal('test1');
          expect(comparator.customFields[1].id).to.equal('test3');
        });
      });

      describe('toggleHiddenField', () => {
        it('adds a hidden field if it is not hidden yet', () => {
          let comparator = Comparators.findOne(comparatorId);
          expect(comparator.hiddenFields.length).to.equal(0);

          toggleHiddenField.call({
            object: { fieldId: 'test' },
            id: comparatorId,
          });

          comparator = Comparators.findOne(comparatorId);
          expect(comparator.hiddenFields.length).to.equal(1);
          expect(comparator.hiddenFields[0]).to.equal('test');
        });

        it('removes a hidden field if it is curently hidden', () => {
          comparatorId = Factory.create('comparator', {
            userId,
            hiddenFields: ['myField'],
          })._id;
          let comparator = Comparators.findOne(comparatorId);
          expect(comparator.hiddenFields.length).to.equal(1);

          toggleHiddenField.call({
            object: { fieldId: 'myField' },
            id: comparatorId,
          });

          comparator = Comparators.findOne(comparatorId);
          expect(comparator.hiddenFields.length).to.equal(0);
        });
      });
    });
  });
});
