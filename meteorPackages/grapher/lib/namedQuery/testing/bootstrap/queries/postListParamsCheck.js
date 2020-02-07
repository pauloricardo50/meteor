import { createQuery } from 'meteor/cultofcoders:grapher';

const postList = createQuery('postListResolverParamsCheck', () => {}, {
  validateParams: {
    title: String,
  },
});

if (Meteor.isServer) {
  postList.expose({});

  postList.resolve(params => [params.title]);
}

export default postList;
