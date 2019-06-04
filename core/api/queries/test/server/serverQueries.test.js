/* eslint-env mocha */
import { Match } from 'meteor/check';
import { testCollectionInsert } from '../methodDefinitions.test';
import TestCollection, {
  query1,
  query2,
  query3,
  query4,
} from '../collection.test';
import { exposeQuery } from '../../queryHelpers';

testCollectionInsert.setHandler((context, params) =>
  TestCollection.insert(params));

exposeQuery(query1, {
  firewall(userId, params) {
    return null;
  },
  // Embody function
  embody: (body, params) => {
    body.$options = { sort: { value: 1 }, limit: 10 };
    body.$filters = { value: { $gt: 20 } };
  },
  validateParams: {
    name: Match.Maybe(String),
  },
});

exposeQuery(
  query2,
  {
    firewall(userId, params) {
      return null;
    },
    // Embody object
    embody: {
      $options: {
        sort: { value: 1 },
        limit: 10,
      },
      // Must use a function, to not be overriden by defaultFilter
      $filter: ({ filters, params }) => {
        filters.value = { $gt: 20 };
      },
    },
    validateParams: {
      name: Match.Maybe(String),
    },
  },
  { allowFilterById: true },
);

exposeQuery(query3);

exposeQuery(
  query4,
  {
    firewall(userId, params) {
      return null;
    },
    // Embody object
    embody: {
      $options: {
        sort: { value: 1 },
        limit: 10,
      },
      // Must use a function, to not be overriden by defaultFilter
      $filter: ({ filters, params }) => {
        filters.value = { $gt: 20 };
      },
    },
    validateParams: {
      name: Match.Maybe(String),
    },
  },
  { allowFilterById: true },
);

// describe.only('test suite name', () => {
//   it('test name', () => {
//     // Test code
//   });
// });
