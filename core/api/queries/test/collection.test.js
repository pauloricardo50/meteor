import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import GoogleMapsAutocompleteResults from 'core/components/GoogleMapsAutocomplete/GoogleMapsAutocompleteResults';

const TestCollection = new Mongo.Collection('collectionTest');

const testCollectionSchema = new SimpleSchema({
  value: Number,
  name: String,
});

TestCollection.attachSchema(testCollectionSchema);

export default TestCollection;

export const query1 = TestCollection.createQuery('TEST_QUERY_1', {
  $filter({ filters, params: { name } }) {
    if (name) {
      filters.name = name;
    }
  },
  value: 1,
  name: 1,
});

export const query2 = TestCollection.createQuery('TEST_QUERY_2', {
  $filter({ filters, params: { name } }) {
    if (name) {
      filters.name = name;
    }
  },
  value: 1,
  name: 1,
});

export const query3 = TestCollection.createQuery('TEST_QUERY_3', {
  $filter({ filters, params: { name } }) {
    if (name) {
      filters.name = name;
    }
  },
  value: 1,
  name: 1,
});

export const query4 = TestCollection.createQuery('TEST_QUERY_4', {
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
});
