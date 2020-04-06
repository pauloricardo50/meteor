/* eslint-env mocha */
import { Match } from 'meteor/check';

import { exposeQuery } from '../../queryHelpers';
import {
  query1,
  query2,
  query3,
  query4,
  testCollectionInsert,
} from '../collection-app-test';

const TestCollection = require('../collection-app-test').default;

testCollectionInsert.setHandler((context, params) =>
  TestCollection.insert(params),
);

exposeQuery({
  query: query1,
  overrides: {
    firewall: (userId, params) => null,
    embody: (body, params) => {
      body.$options = { sort: { value: 1 }, limit: 10 };
      body.$filters = { value: { $gt: 30 } };
    },
    validateParams: { name: Match.Maybe(String) },
  },
});

exposeQuery({
  query: query2,
  overrides: {
    firewall: (userId, params) => null,
    embody: body => {
      body.$options = { sort: { value: 1 }, limit: 10 };
      body.$filters = { value: { $gt: 20 } };
    },
    validateParams: { name: Match.Maybe(String) },
  },
  options: { allowFilterById: true },
});

exposeQuery({ query: query3 });

exposeQuery({
  query: query4,
  overrides: {
    firewall: (userId, params) => null,
    embody: body => {
      body.$options = { sort: { value: 1 }, limit: 10 };
      body.$filters = { value: { $gt: 20 } };
    },
    validateParams: { name: Match.Maybe(String) },
  },
  options: { allowFilterById: true },
});

// describe('test', () => {
//   it('test', () => {});
// });
