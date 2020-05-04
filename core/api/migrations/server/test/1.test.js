import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';

import Properties from '../../../properties';
import { PROPERTY_CATEGORY } from '../../../properties/propertyConstants';
import { down, up } from '../1';

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
