import 'babel-polyfill';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Properties = new Mongo.Collection('properties');

// Prevent all client side modifications of mongoDB
Properties.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
Properties.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

export const PropertySchema = new SimpleSchema({
  userId: {
    type: String,
    index: true,
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    },
  },
  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isInsert || this.isUpdate) {
        return new Date();
      }
    },
  },
  name: String,
  address: String,
  latitude: Number,
  longitude: Number,
  value: Number,
  fields: {
    type: Object,
    blackbox: true,
    defaultValue: {},
  },
});

// Attach schema
Properties.attachSchema(PropertySchema);
export default Properties;
