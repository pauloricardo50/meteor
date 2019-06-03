/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import query from '../query.test';
import { testCollectionInsert } from '../metehodDefinitions.test';

const insertTestData = (n) => {
  const promises = [...Array(n)].map((_, index) =>
    testCollectionInsert.run({ name: `test${index}`, value: index }));
  return Promise.all(promises);
};

const insertAndFetchTestData = (n, params = {}) =>
  insertTestData(n).then(() =>
    new Promise((resolve, reject) => {
      query.clone(params).fetch((err, items) => {
        if (err) {
          reject(err);
        }
        resolve(items);
      });
    }));

describe.only('test suite name', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('test name', () =>
    // Test code
    insertAndFetchTestData(5, {
      $body: { $options: { sort: { number: 1 } } },
    }).then((items) => {
      expect(items.length).to.equal(5);
      expect(items[0].value).to.equal(4);
    }));
});
