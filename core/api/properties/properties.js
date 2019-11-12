import { Mongo } from 'meteor/mongo';
import * as propertyConstants from './propertyConstants';
import PropertySchema from './schemas/PropertySchema';

const Properties = new Mongo.Collection(
  propertyConstants.PROPERTIES_COLLECTION,
);

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

// Attach schema
Properties.attachSchema(PropertySchema);
export default Properties;
