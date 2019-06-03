import { testCollectionInsert } from '../metehodDefinitions.test';
import TestCollection from '../collection.test';

testCollectionInsert.setHandler((context, params) =>
  TestCollection.insert(params));
