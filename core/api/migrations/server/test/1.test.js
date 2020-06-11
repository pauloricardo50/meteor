import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import Properties from '../../../properties';
import { PROPERTY_CATEGORY } from '../../../properties/propertyConstants';
import { down, up } from '../1';

/* eslint-env mocha */

describe('Migration 1', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('adds a category on all properties', () => {
      Properties.insert({ category: null });
      Properties.insert({ category: null });
      Properties.insert({ category: null });

      Properties.find()
        .fetch()
        .forEach(({ category }) => {
          expect(category).to.equal(null);
        });

      up();

      Properties.find()
        .fetch()
        .forEach(({ category }) => {
          expect(category).to.equal(PROPERTY_CATEGORY.USER);
        });
    });
  });

  describe('down', () => {
    it('removes category from all properties', () => {
      Properties.insert({});
      Properties.insert({});
      Properties.insert({});

      Properties.find()
        .fetch()
        .forEach(({ category }) => {
          expect(category).to.equal(PROPERTY_CATEGORY.USER);
        });

      down();

      Properties.find()
        .fetch()
        .forEach(({ category }) => {
          expect(category).to.equal(undefined);
        });
    });
  });
});
