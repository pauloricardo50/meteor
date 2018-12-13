import { Mongo } from 'meteor/mongo';
import { BORROWERS_COLLECTION } from './borrowerConstants';
import borrowerSchema from './schemas/borrowerSchema';

const Borrowers = new Mongo.Collection(BORROWERS_COLLECTION);

// Prevent all client side modifications of mongoDB
Borrowers.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Borrowers.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Borrowers.attachSchema(borrowerSchema);
export default Borrowers;
