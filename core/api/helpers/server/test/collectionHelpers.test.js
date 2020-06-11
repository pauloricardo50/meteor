/* eslint-env mocha */
import { expect } from 'chai';
import SimpleSchema from 'simpl-schema';

import { initializeCollection } from '../../collectionHelpers';

describe('collectionHelpers', () => {
  describe('initializeCollection', () => {
    it('creates a collection and adds a default transform to it', () => {
      const name = 'initializeCollection_A';
      const collectionA = initializeCollection(name);

      collectionA.insert({ hello: 'world' });
      const result = collectionA.findOne({});

      expect(result.hello).to.equal('world');
      expect(result._collection).to.equal(name);
    });

    it('attaches a schema to the collection', () => {
      const name = 'initializeCollection_B';
      const schema = new SimpleSchema({
        hello: { type: String, optional: true },
        world: Number,
      });
      const collectionB = initializeCollection(name, schema);

      collectionB.insert({ hello: { a: '1' }, world: 100 });
      const result = collectionB.findOne({});

      expect(result.hello).to.equal(undefined);
      expect(result.world).to.equal(100);
    });
  });
});
