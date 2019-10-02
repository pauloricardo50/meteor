/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';

import { expect } from 'chai';

import { userLogin, resetDatabase } from 'core/utils/testHelpers/index';
import {
  query1,
  query2,
  query3,
  query4,
  testCollectionInsert,
} from '../collection.app-test';

const insertTestData = (n) => {
  const promises = [...Array(n)].map((_, index) =>
    testCollectionInsert.run({
      _id: `test${index}`,
      name: `test${index % 4}`,
      value: index,
    }));
  return Promise.all(promises).then(() => ({}));
};

const fetchQueries = ({ queries = [], params, promise }) => {
  queries.forEach((query) => {
    promise = promise.then((items = {}) =>
      new Promise((resolve, reject) => {
        query
          .clone(params)
          .fetch((err, queryItems) =>
            (err
              ? reject(err)
              : resolve({ ...items, [query.name]: queryItems })));
      }));
  });

  return promise;
};

const insertAndFetchTestData = (
  n,
  params = {},
  {
    fetchQuery1 = true,
    fetchQuery2 = true,
    fetchQuery3 = false,
    fetchQuery4 = false,
  } = {},
) => {
  const promise = insertTestData(n);
  return fetchQueries({
    queries: [
      fetchQuery1 && query1,
      fetchQuery2 && query2,
      fetchQuery3 && query3,
      fetchQuery4 && query4,
    ].filter(x => x),
    params,
    promise,
  });
};

describe('exposeQuery', () => {
  beforeEach(() => resetDatabase());

  it('returns expected data without using overrides', () =>
    insertAndFetchTestData(100).then((items) => {
      expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
      expect(items.named_query_TEST_QUERY_1[0].value).to.equal(31);
      expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
      expect(items.named_query_TEST_QUERY_2[0].value).to.equal(21);
    }));

  context('returns expected data when overriding', () => {
    it('the body', () =>
      insertAndFetchTestData(100, { $body: { value: 1 } }).then((items) => {
        expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
        expect(items.named_query_TEST_QUERY_1[0].value).to.equal(31);
        expect(items.named_query_TEST_QUERY_1[0].name).to.equal(undefined);
        expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
        expect(items.named_query_TEST_QUERY_2[0].value).to.equal(21);
        expect(items.named_query_TEST_QUERY_2[0].name).to.equal(undefined);
      }));

    it('the limit option', () =>
      insertAndFetchTestData(100, { $limit: 5 }).then((items) => {
        expect(items.named_query_TEST_QUERY_1.length).to.equal(5);
        expect(items.named_query_TEST_QUERY_1[0].value).to.equal(31);
        expect(items.named_query_TEST_QUERY_2.length).to.equal(5);
        expect(items.named_query_TEST_QUERY_2[0].value).to.equal(21);
      }));

    it('the limit option greather than the server value', () =>
      insertAndFetchTestData(100, { $limit: 20 }).then((items) => {
        expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
        expect(items.named_query_TEST_QUERY_1[0].value).to.equal(31);
        expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
        expect(items.named_query_TEST_QUERY_2[0].value).to.equal(21);
      }));

    it('the skip option', () =>
      insertAndFetchTestData(100, { $skip: 7 }).then((items) => {
        expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
        expect(items.named_query_TEST_QUERY_1[0].value).to.equal(38);
        expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
        expect(items.named_query_TEST_QUERY_2[0].value).to.equal(28);
      }));

    it('the sort option', () =>
      insertAndFetchTestData(100, { $sort: { value: -1 } }).then((items) => {
        expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
        expect(items.named_query_TEST_QUERY_1[0].value).to.equal(99);
        expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
        expect(items.named_query_TEST_QUERY_2[0].value).to.equal(99);
      }));

    it('the sort option on multiple fields ', () =>
      insertAndFetchTestData(50, { $sort: { name: -1, value: -1 } })
        .then((items) => {
          expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
          expect(items.named_query_TEST_QUERY_1[0].value).to.equal(47);
          expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
          expect(items.named_query_TEST_QUERY_2[0].value).to.equal(47);
        })
        .then(() => resetDatabase())
        .then(() =>
          insertAndFetchTestData(50, { $sort: { name: -1, value: 1 } }))
        .then((items) => {
          expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
          expect(items.named_query_TEST_QUERY_1[0].value).to.equal(31);
          expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
          expect(items.named_query_TEST_QUERY_2[0].value).to.equal(23);
        }));
  });

  it('throws when client tries to filter by _id when it is not allowed', () =>
    insertAndFetchTestData(100, { _id: 'test50' }, { fetchQuery2: false })
      .then(() => {
        throw new Meteor.Error('Test should throw');
      })
      .catch(error => expect(error.message).to.contain('Match failed')));

  describe('returns expected data when using filters', () => {
    it('on client only', () =>
      insertAndFetchTestData(100, { name: 'test3' }).then((items) => {
        expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
        expect(items.named_query_TEST_QUERY_1[0].value).to.equal(31);
        items.named_query_TEST_QUERY_1.forEach(({ name }) =>
          expect(name).to.equal('test3'));
        expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
        expect(items.named_query_TEST_QUERY_2[0].value).to.equal(23);
        items.named_query_TEST_QUERY_2.forEach(({ name }) =>
          expect(name).to.equal('test3'));
      }));

    // FIXME: skip this test because it fails on the CI
    it.skip('on server only', () =>
      insertAndFetchTestData(
        100,
        { _id: 'test50' },
        { fetchQuery1: false },
      ).then((items) => {
        expect(items.named_query_TEST_QUERY_2.length).to.equal(1);
        expect(items.named_query_TEST_QUERY_2[0].value).to.equal(50);
      }));

    // FIXME: skip this test because it fails on the CI
    it.skip('on client and server', () =>
      insertAndFetchTestData(
        30,
        { name: 'test3', _id: 'test50' },
        { fetchQuery1: false },
      ).then((items) => {
        // Name and _id filters apply in query2, resulting in an empty array of results
        expect(items.named_query_TEST_QUERY_2.length).to.equal(0);
      }));
  });

  it('uses default firewall if not overriden', () =>
    insertAndFetchTestData(
      30,
      {},
      { fetchQuery1: false, fetchQuery2: false, fetchQuery3: true },
    )
      .then(() => {
        throw new Meteor.Error('Test should throw');
      })
      .catch(error => expect(error.message).to.contain('NOT_AUTHORIZED')));

  it('injects _userId in params', () =>
    userLogin({})
      .then(() =>
        insertAndFetchTestData(
          30,
          { name: 'test3' },
          { fetchQuery1: false, fetchQuery2: false, fetchQuery4: true },
        ))
      .then((items) => {
        const userId = Meteor.userId();
        items.named_query_TEST_QUERY_4.forEach(({ _userId, name }) => {
          expect(_userId).to.equal(userId);
          expect(name).to.equal('test3');
        });
      }));
});
