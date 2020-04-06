import { Factory } from 'meteor/dburles:factory';
/* eslint-env mocha */
import { Mongo } from 'meteor/mongo';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { expect } from 'chai';

import generator from '../../server';

const PostCollection = new Mongo.Collection('posts');
const CategoryCollection = new Mongo.Collection('categories');
const CommentCollection = new Mongo.Collection('comments');

PostCollection.addLinks({
  comments: {
    type: '*',
    collection: CommentCollection,
    field: 'commentIds',
    index: true,
  },
  metaComments: {
    type: '*',
    collection: CommentCollection,
    metadata: true,
  },
  category: {
    collection: CategoryCollection,
    type: '1',
  },
  metaCategory: {
    metadata: true,
    collection: CategoryCollection,
    field: 'categoryLinks',
    type: '1',
  },
});

CommentCollection.addLinks({
  post: {
    collection: PostCollection,
    inversedBy: 'comments',
  },
  metaPost: {
    collection: PostCollection,
    inversedBy: 'metaComments',
  },
});

CategoryCollection.addLinks({
  posts: {
    collection: PostCollection,
    inversedBy: 'category',
  },
  metaPosts: {
    collection: PostCollection,
    inversedBy: 'metaCategory',
  },
});

Factory.define('posts', PostCollection, { description: 'post' });
Factory.define('comments', CommentCollection, { description: 'comment' });
Factory.define('specialComment', CommentCollection, {
  description: 'specialComment',
});
Factory.define('categories', CategoryCollection, { description: 'category' });

describe('factoriesHelpers', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('generator', () => {
    it('inserts a tree of objects', () => {
      const { ids, docs, docsById } = generator({
        posts: [
          {
            _id: 'post1',
            metaComments: [{}, { _id: 'comment2' }],
            comments: [{}],
          },
        ],
      });

      expect(ids.posts.length).to.equal(1);
      expect(ids.comments.length).to.equal(3);
      expect(docs.posts.length).to.equal(1);
      expect(docs.comments.length).to.equal(3);
      expect(Object.keys(docsById.posts).length).to.equal(1);
      expect(Object.keys(docsById.comments).length).to.equal(3);
    });

    it('adds linked collections', () => {
      const result = generator({
        posts: [
          {
            _id: 'post1',
            metaComments: [{ _id: 'comment1' }, {}],
            comments: [{}],
            metaCategory: [{ _id: 'category1', $metadata: { test: 'abc' } }],
          },
        ],
      });

      const post = PostCollection.findOne('post1');

      expect(post.commentIds.length).to.equal(1);
      expect(post.categoryLinks).to.deep.equal({
        _id: 'category1',
        test: 'abc',
      });
    });

    it('reuses a docId if provided twice', () => {
      const { ids } = generator({
        comments: [{ post: { _id: 'post1' } }, { post: { _id: 'post1' } }],
      });

      expect(ids.posts.length).to.equal(1);
      expect(ids.comments.length).to.equal(2);

      const post = PostCollection.findOne('post1');

      expect(post.commentIds.length).to.equal(2);
    });

    it('allows using arrays or objects', () => {
      const { ids } = generator({
        comments: [{}, {}],
        posts: { _id: 'post1' },
      });

      expect(ids.posts.length).to.equal(1);
      expect(ids.comments.length).to.equal(2);
    });

    it('uses factory overrides', () => {
      const { docs } = generator({
        posts: [
          {
            comments: [
              { _id: 'comment1' },
              { _id: 'comment2', _factory: 'specialComment' },
            ],
          },
        ],
      });

      expect(docs.comments).to.deep.equal([
        { _id: 'comment1', description: 'comment' },
        { _id: 'comment2', description: 'specialComment' },
      ]);
    });

    it('does not use factories', () => {
      const { docs } = generator(
        {
          posts: [
            {
              comments: [{ _id: 'comment1' }, { _id: 'comment2' }],
            },
          ],
        },
        { useFactories: false },
      );

      expect(docs.comments).to.deep.equal([
        { _id: 'comment1' },
        { _id: 'comment2' },
      ]);
    });
  });
});
