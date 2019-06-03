import CollectionService from '../../../helpers/CollectionService';
import TestCollection from '../collection.test';

export class TestCollectionService extends CollectionService {
  constructor() {
    super(TestCollection);
  }

  insert = ({ name, value }) => TestCollection.insert({ name, value });
}
