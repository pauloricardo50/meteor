import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const TestCollection = new Mongo.Collection('collectionTest');

const testCollectionSchema = new SimpleSchema({
  value: Number,
  name: String,
});

TestCollection.attachSchema(testCollectionSchema);

export default TestCollection;
