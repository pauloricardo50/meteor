import { createQuery } from 'meteor/cultofcoders:grapher';

const postList = createQuery('postListResolverParamsCheckServer', () => {});

if (Meteor.isServer) {
  postList.expose({
    validateParams: {
      title: String,
    },
  });

  postList.resolve(params => [params.title]);
}

export default postList;
