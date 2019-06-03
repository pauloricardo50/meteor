import TestCollection from './collection.test';

export default TestCollection.createQuery('TEST_QUERY_2', {
  $filter({ filters, params: { name } }) {
    if (name) {
      filters.name = name;
    }
  },
  value: 1,
  name: 1,
});
