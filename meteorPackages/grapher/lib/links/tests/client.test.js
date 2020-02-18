import { assert } from 'chai';

describe('Links Client Tests', function() {
  it('Test remove many', function() {
    const PostCollection = new Mongo.Collection(null);
    const CommentCollection = new Mongo.Collection(null);

    PostCollection.addLinks({
      comments: {
        type: 'many',
        collection: CommentCollection,
        field: 'commentIds',
        index: true,
      },
    });

    const postId = PostCollection.insert({ text: 'abc' });
    const commentId = CommentCollection.insert({ text: 'abc' });

    const link = PostCollection.getLink(postId, 'comments');
    link.add(commentId);
    assert.lengthOf(link.find().fetch(), 1);

    link.remove(commentId);

    assert.lengthOf(link.find().fetch(), 0);
  });
});
