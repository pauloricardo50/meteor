/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import CollectionService from '../../server/CollectionService';

const CollectionA = new Mongo.Collection('collectionA');
const CollectionB = new Mongo.Collection('collectionB');

CollectionA.attachSchema(
  new SimpleSchema({
    data: String,
    oneLink: { type: String, optional: true },
    oneMetaLink: { type: Object, optional: true },
    'oneMetaLink._id': { type: String, optional: true },
    'oneMetaLink.meta': { type: String, optional: true },
    manyLink: { type: Array, optional: true },
    'manyLink.$': { type: String, optional: true },
    'manyLink.$._id': { type: String, optional: true },
    manyMetaLink: { type: Array, optional: true },
    'manyMetaLink.$': { type: Object, optional: true },
    'manyMetaLink.$._id': { type: String, optional: true },
    'manyMetaLink.$.meta': { type: String, optional: true },
  }),
);

CollectionB.attachSchema(new SimpleSchema({ data: String }));

CollectionA.addLinks({
  one: {
    collection: CollectionB,
    field: 'oneLink',
    type: 'one',
    metadata: false,
  },
  oneMeta: {
    collection: CollectionB,
    field: 'oneMetaLink',
    type: 'one',
    metadata: true,
  },
  many: {
    collection: CollectionB,
    field: 'manyLink',
    type: 'many',
    metadata: false,
  },
  manyMeta: {
    collection: CollectionB,
    field: 'manyMetaLink',
    type: 'many',
    metadata: true,
  },
});

CollectionB.addLinks({
  oneA: {
    collection: CollectionA,
    inversedBy: 'one',
  },
  oneMetaA: {
    collection: CollectionA,
    inversedBy: 'oneMeta',
  },
  manyA: {
    collection: CollectionA,
    inversedBy: 'many',
  },
  manyMetaA: {
    collection: CollectionA,
    inversedBy: 'manyMeta',
  },
});

class CollectionAService extends CollectionService {
  constructor() {
    super(CollectionA);
  }
}

class CollectionBService extends CollectionService {
  constructor() {
    super(CollectionB);
  }
}

const AService = new CollectionAService();
const BService = new CollectionBService();

describe('CollectionService', () => {
  let ADocId;
  let BDocId;

  const AQuery = docId => ({
    $filters: { _id: docId },
    one: { _id: 1 },
    oneMeta: { _id: 1, metadata: { meta: 1 } },
    many: { _id: 1 },
    manyMeta: { _id: 1, metadata: { meta: 1 } },
  });

  const BQuery = docId => ({
    $filters: { _id: docId },
    oneA: { _id: 1 },
    oneMetaA: { _id: 1, metadata: { meta: 1 } },
    manyA: { _id: 1 },
    manyMetaA: { _id: 1, metadata: { meta: 1 } },
  });

  beforeEach(() => {
    resetDatabase();
  });

  describe('addLink', () => {
    beforeEach(() => {
      ADocId = AService.insert({ data: 'AData' });
      BDocId = BService.insert({ data: 'BData' });
    });

    describe('should add link documents when link strategy is', () => {
      it('one with direct link', () => {
        AService.addLink({ id: ADocId, linkName: 'one', linkId: BDocId });
        expect(AService.createQuery(AQuery(ADocId)).fetchOne()).to.deep.include(
          {
            one: { _id: BDocId },
          },
        );
        expect(BService.createQuery(BQuery(BDocId)).fetchOne()).to.deep.include(
          {
            oneA: [{ _id: ADocId }],
          },
        );
      });

      it('one with inverse link', () => {
        BService.addLink({ id: BDocId, linkName: 'oneA', linkId: ADocId });
        expect(AService.createQuery(AQuery(ADocId)).fetchOne()).to.deep.include(
          {
            one: { _id: BDocId },
          },
        );
        expect(BService.createQuery(BQuery(BDocId)).fetchOne()).to.deep.include(
          {
            oneA: [{ _id: ADocId }],
          },
        );
      });

      it('one-meta with direct link', () => {
        const metadata = { meta: 'someData' };
        AService.addLink({
          id: ADocId,
          linkName: 'oneMeta',
          linkId: BDocId,
          metadata,
        });
        expect(AService.createQuery(AQuery(ADocId)).fetchOne()).to.deep.include(
          {
            oneMeta: { _id: BDocId, $metadata: metadata },
          },
        );
        expect(BService.createQuery(BQuery(BDocId)).fetchOne()).to.deep.include(
          {
            oneMetaA: [{ _id: ADocId, $metadata: metadata }],
          },
        );
      });

      it('one-meta with inverse link', () => {
        const metadata = { meta: 'someData' };
        BService.addLink({
          id: BDocId,
          linkName: 'oneMetaA',
          linkId: ADocId,
          metadata,
        });
        expect(AService.createQuery(AQuery(ADocId)).fetchOne()).to.deep.include(
          {
            oneMeta: { _id: BDocId, $metadata: metadata },
          },
        );
        expect(BService.createQuery(BQuery(BDocId)).fetchOne()).to.deep.include(
          {
            oneMetaA: [{ _id: ADocId, $metadata: metadata }],
          },
        );
      });

      it('many with direct link', () => {
        AService.addLink({
          id: ADocId,
          linkName: 'many',
          linkId: BDocId,
        });
        expect(AService.createQuery(AQuery(ADocId)).fetchOne()).to.deep.include(
          {
            many: [{ _id: BDocId }],
          },
        );
        expect(BService.createQuery(BQuery(BDocId)).fetchOne()).to.deep.include(
          {
            manyA: [{ _id: ADocId }],
          },
        );
      });

      it('many with inverse link', () => {
        BService.addLink({
          id: BDocId,
          linkName: 'manyA',
          linkId: ADocId,
        });

        expect(AService.createQuery(AQuery(ADocId)).fetchOne()).to.deep.include(
          {
            many: [{ _id: BDocId }],
          },
        );
        expect(BService.createQuery(BQuery(BDocId)).fetchOne()).to.deep.include(
          {
            manyA: [{ _id: ADocId }],
          },
        );
      });

      it('many-meta with direct link', () => {
        const metadata = { meta: 'someData' };
        AService.addLink({
          id: ADocId,
          linkName: 'manyMeta',
          linkId: BDocId,
          metadata,
        });
        expect(AService.createQuery(AQuery(ADocId)).fetchOne()).to.deep.include(
          {
            manyMeta: [{ _id: BDocId, $metadata: metadata }],
          },
        );
        expect(BService.createQuery(BQuery(BDocId)).fetchOne()).to.deep.include(
          {
            manyMetaA: [{ _id: ADocId, $metadata: metadata }],
          },
        );
      });

      it('many-meta with inverse link', () => {
        const metadata = { meta: 'someData' };
        BService.addLink({
          id: BDocId,
          linkName: 'manyMetaA',
          linkId: ADocId,
          metadata,
        });

        expect(AService.createQuery(AQuery(ADocId)).fetchOne()).to.deep.include(
          {
            manyMeta: [{ _id: BDocId, $metadata: metadata }],
          },
        );
        expect(BService.createQuery(BQuery(BDocId)).fetchOne()).to.deep.include(
          {
            manyMetaA: [{ _id: ADocId, $metadata: metadata }],
          },
        );
      });
    });
  });

  describe('distinct', () => {
    it('return distinct values', () => {
      CollectionA.insert({ data: '1' });
      CollectionA.insert({ data: '1' });
      CollectionA.insert({ data: '2' });

      const distinct = AService.distinct('data');

      expect(distinct).to.deep.equal(['1', '2']);
    });

    it('returns distinct values with a selector', () => {
      CollectionA.insert({ data: '1' });
      CollectionA.insert({ data: '1' });
      CollectionA.insert({ data: '2' });
      CollectionA.insert({ data: '2' });
      CollectionA.insert({ data: '3' });

      const distinct = AService.distinct('data', { data: { $ne: '1' } });

      expect(distinct).to.deep.equal(['2', '3']);
    });
  });
});
