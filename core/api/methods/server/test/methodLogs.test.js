import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Method } from '../../methods';

const MethodLogs = new Mongo.Collection('methodLogs');

const storeMethodLog = ({ name, userId, params, result, error }) => {
  if (!Meteor.isTest) {
    throw new Meteor.Error('Test only functionality');
  }

  return MethodLogs.insert({
    name,
    userId,
    params: JSON.stringify(params),
    result: JSON.stringify(result),
    error: JSON.stringify(error),
  });
};

export const getMethodLogs = query => {
  if (!Meteor.isTest) {
    throw new Meteor.Error('Test only functionality');
  }

  return MethodLogs.createQuery(query)
    .fetch()
    .map(({ params, result, error, ...rest }) => ({
      params: params && JSON.parse(params),
      result: result && JSON.parse(result),
      error: error && JSON.parse(error),
      ...rest,
    }));
};

Meteor.methods({
  getMethodLogs(query) {
    getMethodLogs(query);
  },
});

Method.addAfterExecution(({ context, config, params, result, error }) => {
  storeMethodLog({
    name: config.name,
    result,
    error,
    params,
    userId: context.userId,
  });
});
