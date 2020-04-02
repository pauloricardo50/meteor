/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';

import { expect } from 'chai';

import { userLogin, resetDatabase } from 'core/utils/testHelpers';
import {
  query1,
  query2,
  query3,
  query4,
  testCollectionInsert,
} from '../collection-app-test';

const insertTestData = n => {
  const promises = [...Array(n)].map((_, index) =>
    testCollectionInsert.run({
      _id: `test${index}`,
      name: `test${index % 4}`,
      value: index,
    }),
  );
  return Promise.all(promises).then(() => ({}));
};

const fetchQueries = ({ queries = [], params, promise }) => {
  queries.forEach(query => {
    promise = promise.then(
      (items = {}) =>
        new Promise((resolve, reject) => {
          query
            .clone(params)
            .fetch((err, queryItems) =>
              err
                ? reject(err)
                : resolve({ ...items, [query.name]: queryItems }),
            );
        }),
    );
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

  it('returns expected data without using overrides', async () => {
    const items = await insertAndFetchTestData(100);

    expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
    expect(items.named_query_TEST_QUERY_1[0].value).to.equal(31);
    expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
    expect(items.named_query_TEST_QUERY_2[0].value).to.equal(21);
  });

  context('returns expected data when overriding', () => {
    it('the body', async () => {
      const items = await insertAndFetchTestData(100, { $body: { value: 1 } });

      expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
      expect(items.named_query_TEST_QUERY_1[0].value).to.equal(31);
      expect(items.named_query_TEST_QUERY_1[0].name).to.equal(undefined);
      expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
      expect(items.named_query_TEST_QUERY_2[0].value).to.equal(21);
      expect(items.named_query_TEST_QUERY_2[0].name).to.equal(undefined);
    });

    it('the limit option', async () => {
      const items = await insertAndFetchTestData(100, { $limit: 5 });

      expect(items.named_query_TEST_QUERY_1.length).to.equal(5);
      expect(items.named_query_TEST_QUERY_1[0].value).to.equal(31);
      expect(items.named_query_TEST_QUERY_2.length).to.equal(5);
      expect(items.named_query_TEST_QUERY_2[0].value).to.equal(21);
    });

    it('the limit option greather than the server value', async () => {
      const items = await insertAndFetchTestData(100, { $limit: 20 });

      expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
      expect(items.named_query_TEST_QUERY_1[0].value).to.equal(31);
      expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
      expect(items.named_query_TEST_QUERY_2[0].value).to.equal(21);
    });

    it('the skip option', async () => {
      const items = await insertAndFetchTestData(100, { $skip: 7 });

      expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
      expect(items.named_query_TEST_QUERY_1[0].value).to.equal(38);
      expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
      expect(items.named_query_TEST_QUERY_2[0].value).to.equal(28);
    });

    it('the sort option', async () => {
      const items = await insertAndFetchTestData(100, { $sort: { value: -1 } });

      expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
      expect(items.named_query_TEST_QUERY_1[0].value).to.equal(99);
      expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
      expect(items.named_query_TEST_QUERY_2[0].value).to.equal(99);
    });

    it('the sort option on multiple fields ', async () => {
      const items = await insertAndFetchTestData(50, {
        $sort: { name: -1, value: -1 },
      });

      expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
      expect(items.named_query_TEST_QUERY_1[0].value).to.equal(47);
      expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
      expect(items.named_query_TEST_QUERY_2[0].value).to.equal(47);

      await resetDatabase();

      const items2 = await insertAndFetchTestData(50, {
        $sort: { name: -1, value: 1 },
      });

      expect(items2.named_query_TEST_QUERY_1.length).to.equal(10);
      expect(items2.named_query_TEST_QUERY_1[0].value).to.equal(31);
      expect(items2.named_query_TEST_QUERY_2.length).to.equal(10);
      expect(items2.named_query_TEST_QUERY_2[0].value).to.equal(23);
    });
  });

  it('throws when client tries to filter by _id when it is not allowed', async () => {
    try {
      await insertAndFetchTestData(
        100,
        { _id: 'test50' },
        { fetchQuery2: false },
      );
      expect(1).to.equal(2, 'Test should throw');
    } catch (error) {
      expect(error.message).to.contain('Match failed');
    }
  });

  // FIXME: skip this test because it fails on the CI
  describe.skip('returns expected data when using filters', () => {
    it('on client only', async () => {
      const items = await insertAndFetchTestData(100, { name: 'test3' });

      expect(items.named_query_TEST_QUERY_1.length).to.equal(10);
      expect(items.named_query_TEST_QUERY_1[0].value).to.equal(31);
      items.named_query_TEST_QUERY_1.forEach(({ name }) =>
        expect(name).to.equal('test3'),
      );
      expect(items.named_query_TEST_QUERY_2.length).to.equal(10);
      expect(items.named_query_TEST_QUERY_2[0].value).to.equal(23);
      items.named_query_TEST_QUERY_2.forEach(({ name }) =>
        expect(name).to.equal('test3'),
      );
    });

    it('on server only', async () => {
      const items = await insertAndFetchTestData(
        100,
        { _id: 'test50' },
        { fetchQuery1: false },
      );

      expect(items.named_query_TEST_QUERY_2.length).to.equal(1);
      expect(items.named_query_TEST_QUERY_2[0].value).to.equal(50);
    });

    it('on client and server', async () => {
      const items = await insertAndFetchTestData(
        30,
        { name: 'test3', _id: 'test50' },
        { fetchQuery1: false },
      );

      // Name and _id filters apply in query2, resulting in an empty array of results
      expect(items.named_query_TEST_QUERY_2.length).to.equal(0);
    });
  });

  it('uses default firewall if not overriden', async () => {
    try {
      await insertAndFetchTestData(
        30,
        {},
        { fetchQuery1: false, fetchQuery2: false, fetchQuery3: true },
      );

      expect(1).to.equal(2, 'Test should throw');
    } catch (error) {
      expect(error.message).to.contain('NOT_AUTHORIZED');
    }
  });

  it('injects _userId in params', async () => {
    const { _id: userId } = await userLogin({});

    const items = await insertAndFetchTestData(
      30,
      { name: 'test3' },
      { fetchQuery1: false, fetchQuery2: false, fetchQuery4: true },
    );

    items.named_query_TEST_QUERY_4.forEach(({ _userId, name }) => {
      expect(_userId).to.equal(userId);
      expect(name).to.equal('test3');
    });

    await new Promise(res => Meteor.logout(res));
  });
});
