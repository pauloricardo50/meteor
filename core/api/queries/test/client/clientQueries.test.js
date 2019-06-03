/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import query1 from '../query1.test';
import query2 from '../query2.test';
import { testCollectionInsert } from '../metehodDefinitions.test';

const insertTestData = (n) => {
  const promises = [...Array(n)].map((_, index) =>
    testCollectionInsert.run({
      _id: `test${index}`,
      name: `test${index % 4}`,
      value: index,
    }));
  return Promise.all(promises);
};

const insertAndFetchTestData = (n, params = {}) =>
  insertTestData(n)
    .then(() =>
      new Promise((resolve, reject) => {
        query1.clone(params).fetch((err, query1Items) => {
          if (err) {
            reject(err);
          }
          resolve(query1Items);
        });
      }))
    .then(query1Items =>
      new Promise((resolve, reject) => {
        query2.clone(params).fetch((err, query2Items) => {
          if (err) {
            reject(err);
          }
          resolve({ query1: query1Items, query2: query2Items });
        });
      }));

describe('exposeQuery', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('returns expected data without using overrides', () =>
    insertAndFetchTestData(100, {}).then((items) => {
      expect(items.query1.length).to.equal(10);
      expect(items.query1[0].value).to.equal(21);
      expect(items.query2.length).to.equal(10);
      expect(items.query2[0].value).to.equal(21);
    }));

  context('returns expected data when overriding', () => {
    it('the body', () =>
      insertAndFetchTestData(100, {
        $body: { value: 1 },
      }).then((items) => {
        expect(items.query1.length).to.equal(10);
        expect(items.query1[0].value).to.equal(21);
        expect(items.query1[0].name).to.equal(undefined);
        expect(items.query2.length).to.equal(10);
        expect(items.query2[0].value).to.equal(21);
        expect(items.query2[0].name).to.equal(undefined);
      }));

    it('the limit option', () =>
      insertAndFetchTestData(100, {
        $limit: 5,
      }).then((items) => {
        expect(items.query1.length).to.equal(5);
        expect(items.query1[0].value).to.equal(21);
        expect(items.query2.length).to.equal(5);
        expect(items.query2[0].value).to.equal(21);
      }));

    it('the limit option greather than the server value', () =>
      insertAndFetchTestData(100, {
        $limit: 20,
      }).then((items) => {
        expect(items.query1.length).to.equal(10);
        expect(items.query1[0].value).to.equal(21);
        expect(items.query2.length).to.equal(10);
        expect(items.query2[0].value).to.equal(21);
      }));

    it('the skip option', () =>
      insertAndFetchTestData(100, {
        $skip: 7,
      }).then((items) => {
        expect(items.query1.length).to.equal(10);
        expect(items.query1[0].value).to.equal(28);
        expect(items.query2.length).to.equal(10);
        expect(items.query2[0].value).to.equal(28);
      }));

    it('the sort option', () =>
      insertAndFetchTestData(100, {
        $sort: { value: -1 },
      }).then((items) => {
        expect(items.query1.length).to.equal(10);
        expect(items.query1[0].value).to.equal(99);
        expect(items.query2.length).to.equal(10);
        expect(items.query2[0].value).to.equal(99);
      }));
  });

  describe('returns expected data when using filters', () => {
    it('on client only', () =>
      insertAndFetchTestData(100, {
        name: 'test3',
      }).then((items) => {
        expect(items.query1.length).to.equal(10);
        expect(items.query1[0].value).to.equal(23);
        expect(items.query2.length).to.equal(10);
        expect(items.query2[0].value).to.equal(23);
      }));

    it('on server only', () =>
      insertAndFetchTestData(100, {
        _id: 'test50',
      }).then((items) => {
        // _id filter does not apply because embody is a function in query1
        expect(items.query1.length).to.equal(10);
        expect(items.query1[0].value).to.equal(21);

        // It does apply here since embody is an object in query2
        expect(items.query2.length).to.equal(1);
        expect(items.query2[0].value).to.equal(50);
      }));

    it('on client and server', () =>
      insertAndFetchTestData(100, {
        name: 'test3',
        _id: 'test50',
      }).then((items) => {
        expect(items.query1.length).to.equal(10);
        expect(items.query1[0].value).to.equal(23);

        // Name and _id filters apply in query2, resulting in an empty array of results
        expect(items.query2.length).to.equal(0);
      }));
  });
});
