const SimpleSchema = require('simpl-schema').default;

const { Mongo } = require('meteor/mongo');
const { Method } = require('../../methods/methods');

const TestCollection = new Mongo.Collection('collectionTest');
const testCollectionSchema = new SimpleSchema({ value: Number, name: String });
TestCollection.attachSchema(testCollectionSchema);

module.exports = {
  default: TestCollection,
  query1: TestCollection.createQuery('TEST_QUERY_1', {
    $filter({ filters, params: { name } }) {
      if (name) {
        filters.name = name;
      }
    },
    value: 1,
    name: 1,
  }),
  query2: TestCollection.createQuery('TEST_QUERY_2', {
    $filter({ filters, params: { name } }) {
      if (name) {
        filters.name = name;
      }
    },
    value: 1,
    name: 1,
  }),
  query3: TestCollection.createQuery('TEST_QUERY_3', {
    $filter({ filters, params: { name } }) {
      if (name) {
        filters.name = name;
      }
    },
    value: 1,
    name: 1,
  }),
  query4: TestCollection.createQuery('TEST_QUERY_4', {
    $filter({ filters, params: { name } }) {
      if (name) {
        filters.name = name;
      }
    },
    $postFilter(results, params) {
      return results.map(res => ({ ...res, _userId: params._userId }));
    },
    value: 1,
    name: 1,
  }),
  testCollectionInsert: new Method({
    name: 'testCollectionInsert',
    params: { value: Number, name: String, _id: String },
  }),
};
